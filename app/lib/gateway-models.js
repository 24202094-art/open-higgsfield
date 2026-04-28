/**
 * Vercel AI Gateway — model registry
 *
 * Maps muapi model IDs to their Vercel AI Gateway equivalents.
 * Models without a gateway mapping are not included here; callers should
 * fall back to the muapi.ai proxy for those.
 *
 * Gateway model IDs follow the format `provider/model-name`.
 * See the full catalogue at https://vercel.com/ai-gateway/models
 */

// ─── Text-to-Image ────────────────────────────────────────────────────────────

export const T2I_GATEWAY_MODELS = {
    // Flux (Black Forest Labs)
    'flux-schnell':             'prodia/flux-fast-schnell',
    'flux-dev':                 'bfl/flux-2-pro',
    'flux-2-dev':               'bfl/flux-2-pro',
    'flux-2-flex':              'bfl/flux-2-flex',
    'flux-2-pro':               'bfl/flux-2-pro',
    'flux-2-klein-4b':          'bfl/flux-2-klein-4b',
    'flux-2-klein-9b':          'bfl/flux-2-klein-9b',
    'flux-kontext-pro-t2i':     'bfl/flux-kontext-pro',
    'flux-kontext-max-t2i':     'bfl/flux-kontext-max',

    // Google Imagen
    'google-imagen4':           'google/imagen-4.0-generate-001',
    'google-imagen4-fast':      'google/imagen-4.0-fast-generate-001',
    'google-imagen4-ultra':     'google/imagen-4.0-ultra-generate-001',

    // OpenAI GPT Image
    'gpt4o-text-to-image':      'openai/gpt-image-2',
    'gpt-image-1.5':            'openai/gpt-image-1.5',

    // ByteDance Seedream
    'bytedance-seedream-v4':    'bytedance/seedream-4.0',
    'bytedance-seedream-v4.5':  'bytedance/seedream-4.5',
    'seedream-5.0':             'bytedance/seedream-5.0-lite',

    // Recraft
    'recraft-v3':               'recraft/recraft-v3',
    'recraft-v4':               'recraft/recraft-v4',
    'recraft-v4-pro':           'recraft/recraft-v4-pro',

    // xAI Grok
    'grok-imagine-text-to-image': 'xai/grok-imagine-image',
};

// ─── Image-to-Image ───────────────────────────────────────────────────────────

export const I2I_GATEWAY_MODELS = {
    // Flux Kontext (editing via fill/inpaint)
    'flux-kontext-pro-i2i':     'bfl/flux-kontext-pro',
    'flux-kontext-max-i2i':     'bfl/flux-kontext-max',

    // Flux 2 editing
    'flux-2-flex-edit':         'bfl/flux-2-flex',
    'flux-2-pro-edit':          'bfl/flux-2-pro',
    'flux-2-klein-4b-edit':     'bfl/flux-2-klein-4b',
    'flux-2-klein-9b-edit':     'bfl/flux-2-klein-9b',

    // OpenAI GPT Image editing
    'gpt4o-edit':               'openai/gpt-image-2',
    'gpt-image-1.5-edit':       'openai/gpt-image-1.5',
    'gpt4o-image-to-image':     'openai/gpt-image-2',

    // xAI Grok
    'grok-imagine-image-to-image': 'xai/grok-imagine-image',
};

// ─── Text-to-Video ────────────────────────────────────────────────────────────

export const T2V_GATEWAY_MODELS = {
    // KlingAI
    'kling-v2.5-turbo-pro-t2v':       'klingai/kling-v2.5-turbo-t2v',
    'kling-v2.6-pro-t2v':             'klingai/kling-v2.6-t2v',
    'kling-v3.0-pro-text-to-video':   'klingai/kling-v3.0-t2v',
    'kling-v3.0-standard-text-to-video': 'klingai/kling-v3.0-t2v',

    // Google Veo
    'veo3-text-to-video':             'google/veo-3.0-generate-001',
    'veo3-fast-text-to-video':        'google/veo-3.0-fast-generate-001',
    'veo3.1-text-to-video':           'google/veo-3.1-generate-001',
    'veo3.1-fast-text-to-video':      'google/veo-3.1-fast-generate-001',

    // Alibaba Wan
    'wan2.5-text-to-video':           'alibaba/wan-v2.5-t2v-preview',
    'wan2.5-text-to-video-fast':      'alibaba/wan-v2.5-t2v-preview',
    'wan2.6-text-to-video':           'alibaba/wan-v2.6-t2v',

    // ByteDance Seedance
    'seedance-lite-t2v':              'bytedance/seedance-v1.0-lite-t2v',
    'seedance-pro-t2v':               'bytedance/seedance-v1.0-pro',
    'seedance-pro-t2v-fast':          'bytedance/seedance-v1.0-pro-fast',
    'seedance-v1.5-pro-t2v':          'bytedance/seedance-v1.5-pro',
    'seedance-v1.5-pro-t2v-fast':     'bytedance/seedance-v1.5-pro-fast',
    'seedance-v2.0-t2v':              'bytedance/seedance-2.0',
    'seedance-v2.0-extend':           'bytedance/seedance-2.0-fast',

    // xAI Grok
    'grok-imagine-text-to-video':     'xai/grok-imagine-video',
};

// ─── Image-to-Video ───────────────────────────────────────────────────────────

export const I2V_GATEWAY_MODELS = {
    // KlingAI
    'kling-v2.1-master-i2v':          'klingai/kling-v2.5-turbo-i2v',
    'kling-v2.1-standard-i2v':        'klingai/kling-v2.5-turbo-i2v',
    'kling-v2.1-pro-i2v':             'klingai/kling-v2.5-turbo-i2v',
    'kling-v2.5-turbo-pro-i2v':       'klingai/kling-v2.5-turbo-i2v',
    'kling-v2.5-turbo-std-i2v':       'klingai/kling-v2.5-turbo-i2v',
    'kling-v2.6-pro-i2v':             'klingai/kling-v2.6-i2v',
    'kling-v3.0-pro-image-to-video':  'klingai/kling-v3.0-i2v',
    'kling-v3.0-standard-image-to-video': 'klingai/kling-v3.0-i2v',
    'kling-o1-image-to-video':        'klingai/kling-v3.0-i2v',

    // Google Veo
    'veo3-image-to-video':            'google/veo-3.0-generate-001',
    'veo3-fast-image-to-video':       'google/veo-3.0-fast-generate-001',
    'veo3.1-image-to-video':          'google/veo-3.1-generate-001',
    'veo3.1-fast-image-to-video':     'google/veo-3.1-fast-generate-001',
    'veo3.1-reference-to-video':      'google/veo-3.1-generate-001',

    // Alibaba Wan
    'wan2.5-image-to-video':          'alibaba/wan-v2.6-i2v',
    'wan2.5-image-to-video-fast':     'alibaba/wan-v2.6-i2v-flash',
    'wan2.6-image-to-video':          'alibaba/wan-v2.6-i2v',
    'wan2.6-r2v':                     'alibaba/wan-v2.6-r2v',

    // ByteDance Seedance
    'seedance-lite-i2v':              'bytedance/seedance-v1.0-lite-i2v',
    'seedance-pro-i2v':               'bytedance/seedance-v1.0-pro',
    'seedance-pro-i2v-fast':          'bytedance/seedance-v1.0-pro-fast',
    'seedance-v1.5-pro-i2v':          'bytedance/seedance-v1.5-pro',
    'seedance-v1.5-pro-i2v-fast':     'bytedance/seedance-v1.5-pro-fast',
    'seedance-v2.0-i2v':              'bytedance/seedance-2.0',

    // xAI Grok
    'grok-imagine-image-to-video':    'xai/grok-imagine-video',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Return the gateway model ID for a given muapi model ID, or null if no
 * mapping exists (caller should fall back to muapi.ai for unmapped models).
 *
 * @param {string} muapiId
 * @param {'t2i'|'i2i'|'t2v'|'i2v'} type
 * @returns {string|null}
 */
export function getGatewayModelId(muapiId, type) {
    const map = {
        t2i: T2I_GATEWAY_MODELS,
        i2i: I2I_GATEWAY_MODELS,
        t2v: T2V_GATEWAY_MODELS,
        i2v: I2V_GATEWAY_MODELS,
    }[type];
    return map?.[muapiId] ?? null;
}
