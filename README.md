# Beyond Blue

An AI-powered platform to explore exoplanets: search and filter NASA exoplanet data, view rich planet profiles, and read AI-generated summaries and stories.

## Monorepo Structure

```bash
/
├─ models/                 # Python FastAPI service + ML models
│  └─ api/                 # API entrypoints, tests, start scripts
├─ web/
│  ├─ backend/             # Node/Express service for server-side helpers
│  └─ frontend/            # Next.js 15 app (Tailwind, Vitest)
```

### Requirements

- Node.js ≥ 20 and Yarn (v1)
- Python ≥ 3.12
- Optional: MongoDB (only if you enable backend Mongo features)

### Quick Start

1) Install dependencies

```bash
# Frontend (Next.js)
cd web/frontend && yarn

# Backend (Express/TypeScript)
cd ../backend && yarn

# Models (FastAPI, via uv or pip)
cd ../../models
# If you use uv (recommended):
uv sync
# or with pip:
pip install -e .
```

2) Configure environment

Create the following files with your local settings:

- Frontend `web/frontend/.env.local`

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

- Backend `web/backend/.env`

```bash
# Required if you use Gemini-powered features
GEMINI_API_KEY=your_key_here
PORT=4000
```

3) Run services (separate terminals)

```bash
# 1) Models API (FastAPI on :8000)
cd models
uvicorn models.api.main:app --reload --host 0.0.0.0 --port 8000

# 2) Backend (Express on :4000)
cd web/backend
yarn dev

# 3) Frontend (Next.js on :3000)
cd web/frontend
yarn dev
```

Open `http://localhost:3000` to use the app.

### Key Scripts

- Frontend
  - `yarn dev` – start Next.js (Turbopack)
  - `yarn build` – build
  - `yarn start` – serve production build
  - `yarn test` – run unit tests (Vitest)

- Backend
  - `yarn dev` – run dev server with ts-node/nodemon
  - `yarn build` – compile TypeScript
  - `yarn start` – run compiled server

- Models
  - FastAPI app entry: `models/api/main.py`
  - Example runner: `models/api/start_api.py`

### API Overview

The frontend integrates with the Models API for planet data and summaries.

Core endpoints (see detailed table in `web/frontend/API_INTEGRATION.md`):

- `GET /ping`
- `GET /planets/:id`
- `GET /confirmed` | `GET /false_positive` | `GET /candidate`
- `GET /search` (supports `pl_name`, `hostname`, `discoverymethod`, `disc_year`, `limit`, `skip`)
- `GET /summary/:id` and `GET /stream-summary/:id`

Configure the frontend to point at your Models API via `NEXT_PUBLIC_API_URL`.

### Development Notes

- UI/UX: The app favors a professional, minimal aesthetic with restrained color usage and clear emphasis on critical actions.
- Frontend stack: Next.js 15, React 19, Tailwind 4, Radix UI, Vitest/RTL.
- Backend stack: Express + TypeScript. Optional integrations (e.g., Gemini) require `GEMINI_API_KEY`.
- Models: FastAPI + scikit-learn. See `models/exo_classification` for artifacts and notebooks.

### Team Members:
- Amul Poudel
- Binod Dhakal
- Gaurab Thapa Chhetri
- Rastrabhusan Dahal
- Samar Ranjit
- Sudin Katuwal - [GitHub](https://github.com/sudinkatuwal7) | [LinkedIn](https://www.linkedin.com/in/sudin-katuwal-111926361/)
