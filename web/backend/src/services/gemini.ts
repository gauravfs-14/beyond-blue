import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  console.warn('Warning: GOOGLE_API_KEY is not set. Gemini client will fail at call time.');
}

let client: any = null;
function getClient(): any {
  if (client) return client;
  if (!API_KEY) throw new Error('GOOGLE_API_KEY not configured');
  // Use `any` for SDK types to keep compatibility across SDK versions.
  client = new (GoogleGenAI as any)({ apiKey: API_KEY } as any);
  return client;
}


async function normalizeResponse(resp: any): Promise<{ text: string }> {
  if (resp == null) throw new Error('empty response');

  if (typeof resp.text === 'string') return { text: resp.text };

  if (Array.isArray(resp.output) && resp.output[0]?.content && resp.output[0].content[0]?.text) {
    return { text: String(resp.output[0].content[0].text) };
  }

  if (resp.response && typeof resp.response.text === 'function') {
    return { text: String(await resp.response.text()) };
  }

  try {
    return { text: JSON.stringify(resp) };
  } catch (e) {
    throw new Error('Unrecognized response shape from Gemini');
  }
}

async function callModel(modelId: string, prompt: string | Array<{ type: string; text: string }>) {
  const ai = getClient();

  // Modern API: ai.models.generateContent({ model, contents })
  if (typeof ai?.models?.generateContent === 'function') {
    const input: any = { model: modelId, contents: prompt };
    const resp = await ai.models.generateContent(input);
    return normalizeResponse(resp);
  }

  // Another modern-ish shape: model = ai.getGenerativeModel({ model }), then model.generateContent(...)
  if (typeof ai?.getGenerativeModel === 'function') {
    try {
      const model = ai.getGenerativeModel({ model: modelId } as any);
      if (typeof model?.generateContent === 'function') {
        const result = await model.generateContent(prompt as any);
        // some SDKs return { response: { text: () => ... } }
        if (result?.response) return normalizeResponse(result.response);
        return normalizeResponse(result);
      }
    } catch (e) {
      // fallthrough to other attempts
    }
  }

  // Older fallback API: ai.generate({ model, prompt })
  if (typeof ai?.generate === 'function') {
    const resp = await ai.generate({ model: modelId, prompt: prompt });
    return normalizeResponse(resp);
  }

  throw new Error('Unsupported GoogleGenAI SDK shape');
}

export async function generateText(prompt: string, options?: { modelFallback?: string[] }) {
  const models = ['gemini-2.5-flash'];
  let lastErr: unknown;
  for (const m of models) {
    try {
      const r = await callModel(m, prompt);
      return r.text;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

// in src/services/gemini.ts (add this helper)
export async function* streamGenerate(prompt: string, options?: { model?: string }) {
  const modelId = options?.model ?? 'gemini-2.5-flash';
  const ai = getClient(); // Assumes getClient returns the GoogleGenAI client instance

  try {
    // 1. Use the official generateContentStream method
    const stream = await ai.models.generateContentStream({
      model: modelId,
      contents: prompt,
    });

    console.log(new Date().toISOString(), 'streaming start');

    // 2. Iterate over the async iterable stream
    for await (const chunk of stream) {
      
      const text = chunk.text;
      console.log(new Date().toISOString(), 'stream chunk', text);
      if (text) {
        // 4. Yield the chunk of text
        yield text;
      }
    }

    console.log(new Date().toISOString(), 'streaming end');
    
  } catch (e) {
    console.error('Gemini streaming error, falling back to full response:', e);
    try {
      const full = await generateText(prompt, { modelFallback: [modelId] });
      yield full;
    } catch (fallbackError) {
      // Re-throw the original or fallback error for the calling code to handle
      throw e; 
    }
  }
}

export default { generateText, streamGenerate };
