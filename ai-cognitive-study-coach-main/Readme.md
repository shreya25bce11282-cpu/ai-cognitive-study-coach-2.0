# AI Cognitive Study Coach

A study session tracker that logs your focus and fatigue after each study
session, then turns that history into insights: burnout risk, your best
time of day to study, how long your sessions should be, and when to take
a break.

## Features

- **Live session tracking** — start a session with a subject, watch a live
  timer while you study, then rate your focus and fatigue when you stop
- **Session history** — a running table of your last 10 sessions
- **Analytics dashboard** — total hours studied, your best time of day to
  study, a predicted optimal session length per subject, and a burnout
  risk indicator (LOW / MEDIUM / HIGH) based on your recent trend
- **Fatigue trend chart** — a day-by-day line chart of average fatigue,
  derived client-side from your raw session history

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
│       │   ├── db.js        # Postgres connection pool (loads .env itself)
│       │   └── schema.sql   # Table definition — run this first
│       ├── controllers/      # Route handlers / query logic
│       └── routes/           # Route definitions
└── frontend/                 # React app
    └── src/
        ├── pages/            # SessionTracker, Dashboard, Fatigue
        ├── components/       # Card, Loader, RatingInput, SessionHistory
        ├── hooks/            # useSessionTracker, useAnalytics, useFatigue
        ├── services/         # api.js — all backend calls in one place
        └── layout/            # MainLayout — tab navigation + header
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

### 4. Try it out

Open `http://localhost:5173`, go to the **Track Session** tab, start a
session, wait a bit, then end it and rate your focus/fatigue. Do this a
handful of times with different subjects and times of day — the
Dashboard and Fatigue tabs need a few sessions logged before their
insights become meaningful (with 0–1 sessions, most cards will say
"not enough data yet", which is expected).

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

- Auth (right now all sessions belong to whoever hits the API — no
  per-user accounts, so this is single-user by design for now)
- Deleting/editing a logged session (the "Discard" button during an
  active session only clears local state — it doesn't delete the
  half-finished row from the database)
- Deployment (currently local-only — both frontend and backend assume
  `localhost`)
