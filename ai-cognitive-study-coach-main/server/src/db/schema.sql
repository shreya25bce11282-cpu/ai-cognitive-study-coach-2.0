-- Run this once against your local Postgres database (named "studycoach"
-- to match .env.example) to create the table every query in this app expects.

CREATE TABLE IF NOT EXISTS study_sessions (
  id SERIAL PRIMARY KEY,
  subject TEXT NOT NULL,
  start_time TIMESTAMP NOT NULL DEFAULT NOW(),
  end_time TIMESTAMP,
  fatigue_rating INTEGER CHECK (fatigue_rating BETWEEN 1 AND 5),
  focus_rating INTEGER CHECK (focus_rating BETWEEN 1 AND 5)
);
