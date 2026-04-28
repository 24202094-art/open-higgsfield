import { NextResponse } from 'next/server';
import { gateway } from '@ai-sdk/gateway';
import { experimental_generateImage as generateImage, generateText } from 'ai';
import { getGatewayModelId } from '@/app/lib/gateway-models';

const MUAPI_BASE = (
    process.env.MUAPI_BASE_URL ||
    process.env.NEXT_PUBLIC_MUAPI_BASE_URL ||
    'https://api.muapi.ai'
).replace(/\/$/, '');

const AI_GATEWAY_ENABLED =
    process.env.AI_GATEWAY_ENABLED === 'true' && !!process.env.AI_GATEWAY_API_KEY;

/**
 * Multimodal LLMs (Nano Banana, GPT Image 2, etc.) generate images via
 * generateText and return them in result.files.  Image-only models (Flux,
 * Imagen, Recraft, Grok Imagine) use experimental_generateImage and return
 * base64 data in result.images.
 */
const MULTIMODAL_IMAGE_MODELS = new Set([
    'openai/gpt-image-2',
    'openai/gpt-image-1.5',
    'openai/gpt-image-1',
    'openai/gpt-image-1-mini',
]);

async function generateViaGateway(gatewayModelId, params) {
    const isMultimodal = MULTIMODAL_IMAGE_MODELS.has(gatewayModelId);

    if (isMultimodal) {
        const messages = [{ role: 'user', content: params.prompt }];
        const result = await generateText({
            model: gateway(gatewayModelId),
            messages,
        });
        const file = result.files?.[0];
        if (!file) throw new Error('No image returned from gateway (multimodal)');
        const base64 = file.base64 || Buffer.from(file.uint8Array).toString('base64');
        const mime = file.mediaType || 'image/png';
        return `data:${mime};base64,${base64}`;
    }

    const imageParams = { model: gateway.image(gatewayModelId), prompt: params.prompt };
    if (params.aspect_ratio) imageParams.aspectRatio = params.aspect_ratio;
    if (params.size) imageParams.size = params.size;

    const result = await generateImage(imageParams);
    const img = result.images?.[0];
    if (!img) throw new Error('No image returned from gateway');
    const base64 = img.base64 || Buffer.from(img.uint8Array).toString('base64');
    const mime = img.mediaType || 'image/png';
    return `data:${mime};base64,${base64}`;
}

async function generateViaMuapi(params) {
    const endpoint = params.muapiEndpoint || params.model;
    const url = `${MUAPI_BASE}/api/v1/${endpoint}`;

    const payload = { prompt: params.prompt };
    if (params.aspect_ratio) payload.aspect_ratio = params.aspect_ratio;
    if (params.resolution) payload.resolution = params.resolution;
    if (params.quality) payload.quality = params.quality;
    if (params.image_url) {
        payload.image_url = params.image_url;
        payload.strength = params.strength || 0.6;
    } else if (params.images_list) {
        payload.images_list = params.images_list;
    } else {
        payload.image_url = null;
    }
    if (params.seed && params.seed !== -1) payload.seed = params.seed;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': params.apiKey || '' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`muapi request failed: ${response.status} - ${errText.slice(0, 120)}…`);
    }

    const submitData = await response.json();
    const requestId = submitData.request_id || submitData.id;
    if (!requestId) {
        // Synchronous response — return as-is
        return submitData;
    }

    // Poll for result
    const pollUrl = `${MUAPI_BASE}/api/v1/predictions/${requestId}/result`;
    for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 2000));
        const pollRes = await fetch(pollUrl, {
            headers: { 'Content-Type': 'application/json', 'x-api-key': params.apiKey || '' },
        });
        if (!pollRes.ok) continue;
        const data = await pollRes.json();
        const status = data.status?.toLowerCase();
        if (status === 'completed' || status === 'succeeded' || status === 'success') {
            const url = data.outputs?.[0] || data.url || data.output?.url;
            return { ...data, url, request_id: requestId };
        }
        if (status === 'failed' || status === 'error') {
            throw new Error(`muapi generation failed: ${data.error || 'unknown error'}`);
        }
    }
    throw new Error('muapi generation timed out');
}

export async function POST(request) {
    let params;
    try {
        params = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { model, type = 't2i', ...rest } = params;
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
                    request_id: `gateway-${crypto.randomUUID()}`,
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
