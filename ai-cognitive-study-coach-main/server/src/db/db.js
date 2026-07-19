import { Pool } from "pg";

// Reads connection details from environment variables (see .env.example).
// Never hardcode real credentials in source — this file is safe to commit,
// your actual .env file is not (it's gitignored).
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "studycoach",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

export default pool;
