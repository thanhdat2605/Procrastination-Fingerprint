## Procrastination Fingerprint

Procrastination Fingerprint dashboard: 24x7 heatmap, today's timeline, weekly stats, top distractions, focus timer, data export. Supports 2 data sources: in-memory backend API or demo data.

## 1) Install & Run

Requirements: Node.js >= 18, npm >= 9.

```bash
git clone <YOUR_GIT_URL>
cd Procrastination_Fingerprint
npm install
```

Run frontend + backend at the same time (recommended):
```bash
npm run dev:all
```

Or run separately:
```bash
# terminal 1: backend (port 3001)
npm run dev:server

# terminal 2: frontend (port 8080)
npm run dev
```

Build/preview:
```bash
npm run build
npm run preview
```

## 2) Main directory structure

```
src/ # Frontend (Vite + React + TS)
app/ # AppProviders, AppRoutes
components/ # UI components & feature blocks
features/
dashboard/
api/ # React Query hooks call API
hooks/ # Hooks logic (focus timer, data)
pages/ # DashboardPage
services/ # export data service
data-source/ # Switch Demo/API mode (context)
settings/ # Settings context/hook
lib/ # demo-data generators, utils
shared/ # api client, utils/format

server/ # Backend (Express + TS, in-memory)
src/
routes/ # /api/* endpoints
services/ # logic to calculate statistics
store.ts # cache (in-memory)
```

## 3) Data source: Demo vs API

- By default runs in API mode (calls in-memory backend).
- Can switch to Demo mode (use sample data) at: Settings & Data → Data Source (Demo/API).
- In Demo mode, write APIs (focus start/end, update settings) will be safe no-op.

## 4) Backend API (in-memory)

- Base URL: `/api` (proxied from Vite to `http://localhost:3001`).
- Main endpoints:
- `GET /api/stats/buckets`: 24x7 heatmap.
- `GET /api/stats/timeline/today`: today's timeline.
- `GET /api/stats/weekly`: 7-day statistics.
- `GET /api/stats/triggers/top`: top distractions.
- `GET /api/stats/recommendations/next-window`: focus window suggestions.
- `GET /api/settings` – `PUT /api/settings`: get/update settings.
- `POST /api/events`: push event activity (for update statistics).
- `POST /api/focus/start` – `POST /api/focus/end`: mark the focus session.

Quick data fetch example (optional):
```bash
curl -X POST http://localhost:3001/api/events \
-H "Content-Type: application/json" \
-d '[{"id":"e1","ts":'$(date +%s%3N)',"domain":"youtube.com","isIdle":false,"kind":"DISTRACTION"}]'
```

## 5) Key Features

- Procrastination Heatmap: 24x7 matrix, detailed tooltip, legend.
- Today Timeline: focus / active / distraction / idle segments by current hour.
- Weekly Stats: total duration, rate, average score, streak, worst day.
- Top Triggers: top distracting domains, progress, trends.
- Next Best Window: suggests next focus hour from data.
- Focus Timer: start/pause/stop; backend sync when in API mode.
- Settings & Data:
- Data Source: toggle between Demo/API.
- Configure distraction domains, capture cycle, learning goals/day.
- Export JSON/CSV of existing data.

## 6) Technology

- Frontend: Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui (Radix UI), React Router, TanStack Query.
- Backend: Express + TypeScript (in-memory store).

## 7) Development notes

- Vite proxy is pre-configured in `vite.config.ts` (port FE 8080 → BE 3001).
- Lint/format: ESLint + Prettier; TypeScript strict is enabled by default.
- Backend data is in-memory; comes with a compute service for easy replacement with DB (SQLite/Prisma) later.

## 8) Scripts

- `npm run dev` – run FE.
- `npm run dev:server` – run BE.
- `npm run dev:all` – run both FE & BE in parallel.
- `npm run build` – build FE.
- `npm run preview` – preview FE build.
