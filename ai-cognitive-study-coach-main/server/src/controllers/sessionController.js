import pool from "../db/db.js";

export const getSessions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM study_sessions
       WHERE user_id = $1
       ORDER BY start_time DESC`,
      [req.userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching sessions");
  }
};

export const startSession = async (req, res) => {
  try {
    const { subject } = req.body;

    const result = await pool.query(
      `INSERT INTO study_sessions (user_id, subject, start_time)
       VALUES ($1, $2, NOW())
       RETURNING *`,
      [req.userId, subject]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error starting session");
  }
};

export const endSession = async (req, res) => {
  try {
    const { session_id, fatigue_rating, focus_rating } = req.body;

    // WHERE clause includes user_id so one user can never end/overwrite
    // another user's session by guessing an id.
    const result = await pool.query(
      `UPDATE study_sessions
       SET end_time = NOW(),
           fatigue_rating = $1,
           focus_rating = $2
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [fatigue_rating, focus_rating, session_id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error ending session");
  }
};
