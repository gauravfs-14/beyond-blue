import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Planet } from './models/planet';

// ---- App setup ----
const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
const PORT = Number(process.env.PORT ?? 3000);

if (!MONGO_URI) {
  console.error('Error: MONGO_URI environment variable is not set.');
  process.exit(1);
}

// ---- Mongo (Mongoose v8+) ----
mongoose.set('sanitizeFilter', true);

(async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000
      // If your URI does NOT include the DB, you can add: dbName: 'BeyondBlue'
    });
    console.log('Connected to MongoDB');

    // Optional sanity logs:
    const conn = mongoose.connection;
    console.log('DB:', conn.name, 'Host:', conn.host, 'Collection:', Planet.collection.name);
    console.log('Planet count:', await Planet.estimatedDocumentCount());
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
