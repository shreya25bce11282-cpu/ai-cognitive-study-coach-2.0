# AI Cognitive Study Coach

A study session tracker that logs your focus and fatigue after each study
session, then turns that history into insights: burnout risk, your best
time of day to study, how long your sessions should be, and when to take
a break.

## Tech stack

- **Backend:** Node.js, Express, PostgreSQL
- **Frontend:** React (Vite), Recharts, Axios

## Project structure

```
ai-cognitive-study-coach/
├── server/                  # Express API
│   └── src/
│       ├── app.js           # Entry point
│       ├── db/
│       │   ├── db.js        # Postgres connection pool
│       │   └── schema.sql   # Table definition — run this first
│       ├── controllers/      # Route handlers / query logic
│       └── routes/           # Route definitions
└── frontend/                 # React app
    └── src/
        ├── pages/            # Dashboard, Fatigue
        ├── components/       # Card, Loader
        ├── hooks/            # useAnalytics, useFatigue
        ├── services/         # api.js — all backend calls in one place
        └── layout/            # MainLayout — tab navigation
```

## Setup

### 1. Database

Create a local Postgres database, then run the schema:

```bash
createdb studycoach
psql -d studycoach -f server/src/db/schema.sql
```

### 2. Environment variables

Copy the example file and fill in your own DB password:

```bash
cp .env.example .env
```

`.env` is gitignored — never commit it.

### 3. Install and run

From the project root:

```bash
npm install
cd frontend && npm install && cd ..
npm run dev
```

This starts the backend on `http://localhost:5000` and the frontend on
`http://localhost:5173` (Vite's default) at the same time.

## API endpoints

All routes are mounted under `/api`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/sessions` | List all study sessions |
| POST | `/api/sessions/start` | Start a session (`{ subject }`) |
| POST | `/api/sessions/end` | End a session (`{ session_id, fatigue_rating, focus_rating }`) |
| GET | `/api/analytics/summary` | Total sessions, hours, avg session length |
| GET | `/api/analytics/fatigue` | Average time before fatigue sets in |
| GET | `/api/analytics/burnout-risk` | LOW / MEDIUM / HIGH risk based on recent sessions |
| GET | `/api/analytics/break-recommendation` | Suggested break length right now |
| GET | `/api/analytics/best-time` | Hour of day with best focus/lowest fatigue |
| GET | `/api/analytics/predict-session?subject=X` | Predicted optimal session length for a subject |
| GET | `/api/analytics/optimal-session?subject=X` | Session length where focus was highest for a subject |
| GET | `/api/analytics/subject-performance` | Focus/fatigue/duration broken down by subject |
| GET | `/api/analytics/recommend-study-plan` | Recommended session length overall |

## Roadmap / not yet built

- Session logging UI (currently only the analytics dashboard is wired up —
  starting/ending a session has to be done via API calls directly)
- Auth (right now all sessions belong to whoever hits the API — no
  per-user accounts)
