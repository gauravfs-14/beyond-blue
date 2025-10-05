import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Planet } from './models/planet';
import cors from 'cors';

// import { isSafeUrl, fetchHtml, extractMainText, extractHrefFromPlRefname } from './utils/summarize';
import { generateText } from './services/gemini';
import { streamGenerate } from './services/gemini'; // see streaming helper below


// ---- App setup ----
const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));



const MONGO_URI = process.env.MONGO_URI;
const PORT = Number(process.env.PORT ?? 3000);

if (!MONGO_URI) {
  console.error('Error: MONGO_URI environment variable is not set.');
  process.exit(1);
}





const summaryCache = new Map<string, { at: number; data: any }>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

function getCached(id: string) {
  const hit = summaryCache.get(id);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    summaryCache.delete(id);
    return null;
  }
  return hit.data;
}
function setCached(id: string, data: any) {
  summaryCache.set(id, { at: Date.now(), data });
}








// ---- Mongo (Mongoose v8+) ----
mongoose.set('sanitizeFilter', true);

(async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000
      // If your URI does NOT include the DB, you can add: dbName: 'BeyondBlue'
    });
    // console.log('Connected to MongoDB');

    // Optional sanity logs:
    const conn = mongoose.connection;
    // console.log('DB:', conn.name, 'Host:', conn.host, 'Collection:', Planet.collection.name);
    // console.log('Planet count:', await Planet.estimatedDocumentCount());
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
})();

// ---- small helpers ----
const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

const parseNum = (v: unknown, d: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

type SortSpec = Record<string, 1 | -1> | undefined;

function getPaging(q: Request['query']): { limit: number; skip: number; sort: SortSpec } {
  const MAX_LIMIT = 200;
  const limit = Math.min(Math.max(parseNum(q.limit, 100), 1), MAX_LIMIT);
  const skip = Math.max(parseNum(q.skip, 0), 0);

  let sort: SortSpec = undefined;
  if (q.sort) {
    sort = {};
    const parts = String(q.sort).split(',').map((s) => s.trim());
    for (const p of parts) {
      if (!p) continue;
      if (p.includes(':')) {
        const [k, dir] = p.split(':');
        (sort as Record<string, 1 | -1>)[k] = Number(dir) < 0 ? -1 : 1;
      } else {
        const key = p.replace(/^-/, '');
        (sort as Record<string, 1 | -1>)[key] = p.startsWith('-') ? -1 : 1;
      }
    }
  }
  return { limit, skip, sort };
}

// ---- Health ----
app.get('/ping', (_req: Request, res: Response) => res.json({ ok: true, message: 'pong' }));

// ===================== PLANETS =====================

// GET /planets?pl_name=&hostname=&disposition=&disc_year=
app.get('/planets', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, skip, sort } = getPaging(req.query);

    // Build filter with proper types
    const filter: Record<string, unknown> = {};

    // FIX: your data uses a flat `disc_year` (NOT "discovery.year")
    if (req.query.disc_year) {
      const y = Number(req.query.disc_year);
      if (Number.isFinite(y)) filter.disc_year = y;
    }

    if (req.query.pl_name) filter.pl_name = new RegExp(`^${String(req.query.pl_name)}$`, 'i');
    if (req.query.hostname) filter.hostname = new RegExp(`^${String(req.query.hostname)}$`, 'i');
    if (req.query.disposition) filter.disposition = new RegExp(`^${String(req.query.disposition)}$`, 'i');

    const q = Planet.find(filter).skip(skip).limit(limit).lean();
    if (sort) q.sort(sort);
    const docs = await q.exec();
    res.json(docs);
  } catch (err) {
    next(err);
  }
});

app.get('/planets/:_id', async (req: Request<{ _id: string }>, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.params;
    if (!isValidId(_id)) return res.status(400).json({ error: 'Invalid ID' });

    const doc = await Planet.findById(_id).lean().exec();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.json(doc);
  } catch (err) {
    next(err);
  }
});


// Search for a specific parameter



app.get('/confirmed', async (req, res, next) => {
    try {
        const { limit, skip, sort } = getPaging(req.query);
        const q = Planet.find({ disposition: /^CONFIRMED$/i }).skip(skip).limit(limit).lean();
        if (sort) q.sort(sort);
        const docs = await q.exec();
        return res.json(docs);
    } catch (err) {
        next(err);
    }
});
app.get('/candidate', async (req, res, next) => {
    try {
        const { limit, skip, sort } = getPaging(req.query);
        const q = Planet.find({ disposition: /^Candidate$/i }).skip(skip).limit(limit).lean();
        if (sort) q.sort(sort);
        const docs = await q.exec();
        return res.json(docs);
    } catch (err) {
        next(err);
    }
});

app.get('/false_positive', async (req, res, next) => {
    try {
        const { limit, skip, sort } = getPaging(req.query);
        const q = Planet.find({ disposition: /^FALSE POSITIVE$/i }).skip(skip).limit(limit).lean();
        if (sort) q.sort(sort);
        const docs = await q.exec();
        return res.json(docs);
    } catch (err) {
        next(err);
    }
});

app.get('/summarize/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    // cache
    const cached = getCached(id);
    if (cached) return res.json(cached);

    // find planet
    const planet = await Planet.findById(id).lean().exec();

    if (!planet) return res.status(404).json({ error: 'Planet not found' });
    // console.log('Planet:', planet.pl_name, planet.hostname);

    // Build a concise prompt that passes the entire planet document to Gemini.
    // Ask for a factual, at-most-3-sentence summary and no extra text.
    const MAX = 150_000;
    const planetJson = JSON.stringify(planet, null, 2);
    const clipped = planetJson.length > MAX ? planetJson.slice(0, MAX) : planetJson;

    const prompt = [
      'You are an expert astrophysics summarizer.',
      'Task: Given the following JSON document that represents a planet record, produce a concise factual summary about the planet in AT MOST 5 sentences.',
      'Constraints:',
      '- Use ONLY the information present in the provided JSON. Do NOT add outside knowledge or hallucinate.',
      "- Return ONLY the summary text (no headers, labels, or commentary).",
      '',
      'Planet JSON:',
      clipped
    ].join('\n');

    const summary = await generateText(prompt);

    const payload = {
      id,
      // no sourceUrl when summarizing from DB record
      title: (planet as any).pl_name ?? null,
      summaryModel: 'gemini-2.5-flash',
      summary
    };

    setCached(id, payload);
    return res.json(payload);
  } catch (err: any) {
    // Friendly errors for common cases
    if (err?.code === 'NO_LLM') {
      return res.status(501).json({ error: 'LLM not configured. Set GOOGLE_API_KEY.' });
    }
    if (err?.name === 'AbortError') {
      return res.status(504).json({ error: 'Upstream fetch timed out' });
    }
    next(err);
  }
});


app.get('/stream-summary/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).end();

  const planet = await Planet.findById(id).lean().exec();
  if (!planet) return res.status(404).end();

  // Prepare prompt (example)
  const prompt = [
    'You are an expert astrophysics summarizer.',
    'Produce a concise factual summary about the planet in AT MOST 3 sentences.',
    '- Use ONLY information present in the JSON below. No outside knowledge.',
    '- Return only the summary text (no headings, no commentary).',
    '',
    'Planet JSON:',
    JSON.stringify(planet, null, 2)
  ].join('\n');

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  // Prevent nginx buffering
  res.setHeader('X-Accel-Buffering', 'no');

  // Flush headers (once)
  res.flushHeaders?.();

  // Close response when client disconnects
  const onClose = () => {
    // If your SDK supports cancel token/abort, call it here.
    req.off('close', onClose);
    res.end();
  };
  req.on('close', onClose);

  try {
    // streamGenerate yields strings (chunks)
    const stream = streamGenerate(prompt);

    for await (const chunk of stream) {
      // sanitize chunk if needed
      const safe = (chunk ?? '').toString();
      // SSE message (send JSON payload so you can add metadata)
      res.write(`data: ${JSON.stringify({ chunk: safe })}\n\n`);
      // flush if available
      (res as any).flush?.();
    }

    // done event
    res.write(`event: done\ndata: {}\n\n`);
    res.end();
  } catch (err: any) {
    // send error as SSE event, then close
    res.write(`event: error\ndata: ${JSON.stringify({ message: err?.message ?? String(err) })}\n\n`);
    res.end();
  }
});


// Root
app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Exoplanet API. Use /planets endpoints to explore.');
});

// 404
app.use((_req: Request, res: Response) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (err?.name === 'ValidationError') {
    return res.status(400).json({ error: 'ValidationError', details: err.errors });
  }
  res.status(500).json({ error: 'Server error' });
});

// Start server (after file is loaded; connection is async but that’s fine)
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
