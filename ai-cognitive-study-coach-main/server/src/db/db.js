import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Loaded here (not just in app.js) because ES module imports execute
// before any code in the importing file's body — by the time app.js's
// own dotenv.config() call ran, this file had already created the Pool
// with undefined env vars. Loading it here, before the Pool is built,
// guarantees the env vars exist first.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

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
