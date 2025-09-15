# Procrastination Fingerprint

A dashboard to track your **procrastination fingerprint**: 24×7 heatmap, today timeline, weekly stats, top distraction triggers, focus timer, and data export. Supports 2 data sources: an in-memory backend API or demo data.

---

## 1) Install & Run

**Requirements:** Node.js ≥ 18, npm ≥ 9.

```bash
git clone <YOUR_GIT_URL>
cd Procrastination_Fingerprint
npm install
```

Run frontend + backend together (**recommended**):
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

---

## 2) Project Structure

```
src/                      # Frontend (Vite + React + TS)
  app/                    # AppProviders, AppRoutes
  components/             # UI components & feature blocks
  features/
    dashboard/
      api/                # React Query hooks calling the API
      hooks/              # Hooks logic (focus timer, data)
      pages/              # DashboardPage
      services/           # export data service
    data-source/          # Toggle Demo/API (context)
    settings/             # Settings context/hook
  lib/                    # demo-data generators, utils
  shared/                 # api client, utils/format

server/                   # Backend (Express + TS, in-memory)
  src/
    routes/               # /api/* endpoints
    services/             # computation/aggregation logic
    store.ts              # in-memory store
```

---

## 3) Data Sources: Demo vs API

- Default mode is **API** (calls the in-memory backend).
- You can switch to **Demo** mode (use sample data) at: **Settings & Data → Data Source (Demo/API)**.
- In Demo mode, write APIs (focus start/end, update settings) are **safe no-ops**.

---

## 4) Backend API (in-memory)

- **Base URL:** `/api` (proxied by Vite to `http://localhost:3001`).

- **Key endpoints:**
  - `GET /api/stats/buckets` — 24×7 heatmap.
  - `GET /api/stats/timeline/today` — today’s timeline.
  - `GET /api/stats/weekly` — 7‑day aggregate stats.
  - `GET /api/stats/triggers/top` — top distraction triggers (domains).
  - `GET /api/stats/recommendations/next-window` — recommend the next best focus window.
  - `GET /api/settings` — get settings.
  - `PUT /api/settings` — update settings.
  - `POST /api/events` — push activity events (updates statistics).
  - `POST /api/focus/start` — mark focus session start.
  - `POST /api/focus/end` — mark focus session end.

**Quick data injection example (optional):**
```bash
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -d '[{"id":"e1","ts":'$(date +%s%3N)',"domain":"youtube.com","isIdle":false,"kind":"DISTRACTION"}]'
```

> On Windows PowerShell, replace the `$(date +%s%3N)` expression with an equivalent timestamp generator.

---

## 5) Features

- **Procrastination Heatmap:** 24×7 matrix with detailed tooltips and legend.
- **Today Timeline:** segments for focus / active / distraction / idle across the current day.
- **Weekly Stats:** total durations, ratios, average score, streak, worst day.
- **Top Triggers:** top distraction domains with progress and trend.
- **Next Best Window:** suggest the next focus window based on your data.
- **Focus Timer:** start / pause / stop; syncs to backend in API mode.
- **Settings & Data:**
  - Data Source switch between Demo and API.
  - Configure distraction domains, capture interval, daily learning goals.
  - Export current data to JSON/CSV.

---

## 6) Tech Stack

- **Frontend:** Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui (Radix UI), React Router, TanStack Query.
- **Backend:** Express + TypeScript (in-memory store).

---

## 7) Development Notes

- Vite proxy is preconfigured in `vite.config.ts` (FE port 8080 → BE port 3001).
- Lint/format: ESLint + Prettier; TypeScript **strict** enabled by default.
- Backend data is in-memory only; services are structured to be easily swapped for a DB (e.g., SQLite/Prisma) later.

---

## 8) NPM Scripts

- `npm run dev` — run frontend.
- `npm run dev:server` — run backend.
- `npm run dev:all` — run both frontend & backend in parallel.
- `npm run build` — build frontend.
- `npm run preview` — preview built frontend.
