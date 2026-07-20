# AI Cognitive Study Coach

A full-stack study session tracker that logs focus and fatigue after every
study session, then turns that history into insights — burnout risk, your
best time of day to study, predicted optimal session length, and an
AI-generated summary of your patterns.

## Features

- **Authentication** — JWT-based signup/login; every user's data is
  isolated (enforced at the query level, not just the UI)
- **Live session tracking** — start a session with a subject, watch a live
  timer, then rate focus and fatigue when you stop; the active session
  survives a page refresh
- **Analytics dashboard** — total hours studied, best time of day to study,
  predicted optimal session length per subject, and a burnout risk
  indicator (LOW / MEDIUM / HIGH) based on recent trend
- **AI-generated insights** — recent session history is sent to Claude
  (Anthropic's API) for a genuinely personalized observation, not just a
  templated string. Falls back to a rule-based summary if no API key is
  configured, so the app is fully functional either way
- **Fatigue trend chart** — a day-by-day line chart derived client-side
  from raw session history
- **Input validation** — every request body is validated with `zod` before
  it touches the database
- **Automated tests** — Jest + Supertest covering validation, auth
  middleware, and controller logic (mocked DB, no live Postgres needed to
  run the suite)

## Tech stack

- **Backend:** Node.js, Express, PostgreSQL, JWT auth (bcrypt + jsonwebtoken), Zod
- **Frontend:** React (Vite), Recharts, Axios
- **AI:** Anthropic API (Claude)
- **Testing:** Jest, Supertest
- **Deployment:** Docker, Render (backend + Postgres), Vercel (frontend)

## Project structure

```
ai-cognitive-study-coach/
├── server/
│   ├── src/
│   │   ├── app.js               # Entry point
│   │   ├── db/
│   │   │   ├── db.js             # Postgres connection pool
│   │   │   └── schema.sql        # users + study_sessions tables
│   │   ├── controllers/          # auth, sessions, analytics, AI insight
│   │   ├── routes/
│   │   ├── middleware/           # JWT auth, request validation
│   │   └── validation/           # zod schemas
│   └── tests/                    # Jest + Supertest
├── frontend/
│   └── src/
│       ├── pages/                 # Auth, SessionTracker, Dashboard, Fatigue
│       ├── components/            # Card, Loader, RatingInput, SessionHistory
│       ├── hooks/                 # useAuth, useSessionTracker, useAnalytics, useFatigue
│       ├── services/api.js        # all backend calls, in one place
│       └── layout/MainLayout.jsx  # tab nav + auth gate
├── Dockerfile / docker-compose.yml
├── render.yaml                    # Render blueprint (backend + DB)
└── frontend/vercel.json           # Vercel config (frontend)
```

## Local setup

### 1. Database

```bash
createdb studycoach
psql -d studycoach -f server/src/db/schema.sql
```

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in your Postgres password and a `JWT_SECRET` (generate one with
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
`ANTHROPIC_API_KEY` is optional — leave it blank to use the rule-based
insight fallback instead of a live API call.

`.env` is gitignored — never commit it.

### 3. Install and run

```bash
npm install
cd frontend && npm install && cd ..
npm run dev
```

Backend on `http://localhost:5000`, frontend on `http://localhost:5173`.

### 4. Run the tests

```bash
npm test
```

### 5. Or run it with Docker (backend + Postgres only)

```bash
docker compose up
# then, separately:
cd frontend && npm run dev
```

## Deployment

This is set up for a split deploy — backend on Render, frontend on Vercel.

**Backend (Render):**
1. Push this repo to GitHub
2. On Render, "New +" → "Blueprint" → point it at this repo (it reads `render.yaml`)
3. Set the `ANTHROPIC_API_KEY` env var in the Render dashboard if you want live AI insights
4. Once deployed, run `schema.sql` against the managed Postgres instance Render creates

**Frontend (Vercel):**
1. Import this repo, set the root directory to `frontend/`
2. Add an environment variable `VITE_API_URL` pointing to your Render backend URL, e.g. `https://ai-study-coach-api.onrender.com/api`
3. Deploy

## API endpoints

All routes are mounted under `/api`. Everything except `/auth/*` requires
`Authorization: Bearer <token>`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create an account (`{ email, password }`) |
| POST | `/api/auth/login` | Log in, returns a JWT |
| GET | `/api/sessions` | List the logged-in user's study sessions |
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
| GET | `/api/analytics/ai-insight` | Claude-generated (or rule-based fallback) personalized insight |

## Known limitations / roadmap

- No password reset flow
- "Discard" on an in-progress session clears local state only — it doesn't
  delete the half-finished row from the database
- CORS currently allows all origins — fine for a solo project, would need
  tightening (`cors({ origin: <your frontend URL> })`) before wider use
