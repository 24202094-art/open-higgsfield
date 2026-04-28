import { NextResponse } from 'next/server';
import { gateway } from '@ai-sdk/gateway';
import { experimental_generateVideo as generateVideo } from 'ai';
import { getGatewayModelId } from '@/app/lib/gateway-models';

// Video generation can take several minutes; set a generous route timeout.
export const maxDuration = 300; // seconds (Vercel Pro/Enterprise)

const MUAPI_BASE = (
    process.env.MUAPI_BASE_URL ||
    process.env.NEXT_PUBLIC_MUAPI_BASE_URL ||
    'https://api.muapi.ai'
).replace(/\/$/, '');

const AI_GATEWAY_ENABLED =
    process.env.AI_GATEWAY_ENABLED === 'true' && !!process.env.AI_GATEWAY_API_KEY;

async function generateViaGateway(gatewayModelId, params) {
    const videoParams = {
        model: gateway.video(gatewayModelId),
        prompt: params.prompt,
    };
    if (params.aspect_ratio) videoParams.aspectRatio = params.aspect_ratio;
    if (params.duration) videoParams.duration = params.duration;
    if (params.resolution) videoParams.resolution = params.resolution;
    if (params.image_url) {
        // Image-to-video: provide image alongside prompt
        videoParams.prompt = { image: params.image_url, text: params.prompt || '' };
    }

    const result = await generateVideo(videoParams);
    const vid = result.videos?.[0];
    if (!vid) throw new Error('No video returned from gateway');
    const base64 = vid.base64 || Buffer.from(vid.uint8Array).toString('base64');
    return `data:video/mp4;base64,${base64}`;
}

async function generateViaMuapi(params) {
    const endpoint = params.muapiEndpoint || params.model;
    const url = `${MUAPI_BASE}/api/v1/${endpoint}`;

    const payload = {};
    if (params.prompt) payload.prompt = params.prompt;
    if (params.aspect_ratio) payload.aspect_ratio = params.aspect_ratio;
    if (params.duration) payload.duration = params.duration;
    if (params.resolution) payload.resolution = params.resolution;
    if (params.quality) payload.quality = params.quality;
    if (params.mode) payload.mode = params.mode;
    if (params.image_url) payload.image_url = params.image_url;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': params.apiKey || '' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`muapi request failed: ${response.status} - ${errText.slice(0, 120)}`);
    }

    const submitData = await response.json();
    const requestId = submitData.request_id || submitData.id;
    if (!requestId) return submitData;

    // Poll — video generation may take up to 5 minutes
    const pollUrl = `${MUAPI_BASE}/api/v1/predictions/${requestId}/result`;
    for (let i = 0; i < 150; i++) {
        await new Promise(r => setTimeout(r, 2000));
        const pollRes = await fetch(pollUrl, {
            headers: { 'Content-Type': 'application/json', 'x-api-key': params.apiKey || '' },
        });
        if (!pollRes.ok) continue;
        const data = await pollRes.json();
        const status = data.status?.toLowerCase();
        if (status === 'completed' || status === 'succeeded' || status === 'success') {
            const outputUrl = data.outputs?.[0] || data.url || data.output?.url;
            return { ...data, url: outputUrl, request_id: requestId };
        }
        if (status === 'failed' || status === 'error') {
            throw new Error(`muapi generation failed: ${data.error || 'unknown error'}`);
        }
    }
    throw new Error('muapi video generation timed out');
}

export async function POST(request) {
    let params;
    try {
        params = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { model, type = 't2v', ...rest } = params;
    if (!model) {
        return NextResponse.json({ error: 'model is required' }, { status: 400 });
    }

    try {
        if (AI_GATEWAY_ENABLED) {
            const gatewayModelId = getGatewayModelId(model, type);
            if (gatewayModelId) {
                const dataUri = await generateViaGateway(gatewayModelId, { ...rest, model });
                return NextResponse.json({
                    url: dataUri,
                    request_id: `gateway-${Date.now()}`,
                    status: 'completed',
                });
            }
        }

        // Fallback: proxy to muapi.ai
        const result = await generateViaMuapi({ ...rest, model });
        return NextResponse.json(result);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
