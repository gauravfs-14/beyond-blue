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

export async function summarizeText(text: string, ctx?: { title?: string; url?: string }) {
  const MAX = 150_000;
  const clipped = text.length > MAX ? text.slice(0, MAX) : text;

  const prompt = [
    'You are an expert technical summarizer.',
    ctx?.title ? `Title: ${ctx.title}` : '',
    ctx?.url ? `Source: ${ctx.url}` : '',
    '',
    'Summarize clearly for developers:',
    '- 3–6 bullet points',
    '- key numbers/dates',
    '- one-sentence TL;DR at end',
    '',
    'Text:',
    clipped
  ].join('\n');

  return await generateText(prompt);
}

/**
 * Summarize details about a specific planet from a research paper's text.
 * - planetName: the planet to look for (exact name)
 * - paperText: full text (or clipped) of the research paper
 * Behavior:
 * - Use only facts found in the provided paper text.
 * - Return only the summary (no leading/trailing commentary).
 * - Maximum 5 sentences. If fewer facts exist, return fewer sentences.
 */
export async function summarizePlanetFromPaper(planetName: string, paperText: string) {
  const MAX = 150_000;
  const clipped = paperText.length > MAX ? paperText.slice(0, MAX) : paperText;

  const prompt = [
    `You are an expert astrophysics research assistant.`,
    `Task: Extract only factual statements from the provided research paper about the planet named "${planetName}".`,
    `Constraints:`,
    `- Use ONLY information present in the paper text below. Do NOT use outside knowledge or hallucinate.`,
    `- Provide at most 5 sentences. Each sentence should be concise and factual.`,
    `- Do NOT include any intro, footer, labels, or commentary. RETURN ONLY the sentences (no "Summary:" or similar).`,
    `- If the paper contains no information about ${planetName}, return a single sentence: "No information about ${planetName} found in the provided text."`,
    '',
    'Paper text:',
    clipped
  ].join('\n');

  // Ask the model and then strictly post-check the response to trim whitespace and
  // ensure no extra text before/after. We also enforce sentence cap on the client-side
  // as a safety net (split by sentence-ending punctuation).
  let raw = await generateText(prompt);
  raw = raw.trim();

  // If model returned the special single-sentence no-info message, return it verbatim.
  if (raw === `No information about ${planetName} found in the provided text.`) return raw;

  // Split into sentences (simple heuristic). Keep up to 5 sentences.
  const sentences = raw
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);

  // If no sentences found, return a safe message.
  if (sentences.length === 0) return `No information about ${planetName} found in the provided text.`;

  // Join back into a single block with spaces (or newlines if you prefer).
  return sentences.join(' ');
}

export default { generateText, summarizeText, summarizePlanetFromPaper };
