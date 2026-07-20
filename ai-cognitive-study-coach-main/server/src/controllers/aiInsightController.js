import pool from "../db/db.js";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001"; // cheap + fast, plenty for a short insight

// Builds a compact natural-language summary of recent sessions to send to
// the model — deliberately small (last 15 sessions) to keep token cost low.
function summarizeSessions(sessions) {
  if (sessions.length === 0) return "No completed study sessions yet.";

  const lines = sessions.map((s) => {
    const duration = s.end_time
      ? Math.round((new Date(s.end_time) - new Date(s.start_time)) / 60000)
      : null;
    const when = new Date(s.start_time).toLocaleString("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
    });
    return `- ${s.subject}, ${when}, ${duration ?? "?"} min, focus ${s.focus_rating ?? "?"}/5, fatigue ${s.fatigue_rating ?? "?"}/5`;
  });

  return lines.join("\n");
}

// Rule-based fallback — the same logic the rest of the app already uses
// elsewhere, kept here so this endpoint still returns something useful
// when no ANTHROPIC_API_KEY is configured (e.g. a fresh clone of the repo).
function fallbackInsight(sessions) {
  if (sessions.length === 0) {
    return "Log a few study sessions and check back — there's nothing to analyze yet.";
  }
  const avgFocus =
    sessions.reduce((sum, s) => sum + (s.focus_rating || 0), 0) / sessions.length;
  const avgFatigue =
    sessions.reduce((sum, s) => sum + (s.fatigue_rating || 0), 0) / sessions.length;

  if (avgFatigue >= 4) {
    return `Your fatigue has averaged ${avgFatigue.toFixed(1)}/5 recently — that's high. Consider shorter sessions with more breaks.`;
  }
  if (avgFocus >= 4) {
    return `Solid focus lately, averaging ${avgFocus.toFixed(1)}/5. Whatever you're doing is working — keep the routine.`;
  }
  return `Focus has averaged ${avgFocus.toFixed(1)}/5 and fatigue ${avgFatigue.toFixed(1)}/5 recently — fairly steady, nothing alarming.`;
}

export const getAiInsight = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT subject, start_time, end_time, focus_rating, fatigue_rating
       FROM study_sessions
       WHERE user_id = $1 AND end_time IS NOT NULL
       ORDER BY start_time DESC
       LIMIT 15`,
      [req.userId]
    );
    const sessions = result.rows;

    // No API key configured — return the rule-based fallback instead of
    // failing outright, so the feature degrades gracefully rather than
    // breaking the dashboard for anyone who hasn't set one up.
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({
        insight: fallbackInsight(sessions),
        source: "fallback",
      });
    }

    if (sessions.length === 0) {
      return res.json({
        insight: "Log a few study sessions and check back — there's nothing to analyze yet.",
        source: "fallback",
      });
    }

    const prompt = `Here is a student's recent study session history:\n\n${summarizeSessions(
      sessions
    )}\n\nIn 2-3 short sentences, give them one specific, actionable observation about their study patterns (timing, fatigue, focus, or session length). Be direct and concrete, not generic. No greeting, no sign-off, just the observation.`;

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error("Anthropic API error:", response.status, await response.text());
      return res.json({ insight: fallbackInsight(sessions), source: "fallback" });
    }

    const data = await response.json();
    const text = data.content?.find((block) => block.type === "text")?.text;

    res.json({
      insight: text || fallbackInsight(sessions),
      source: text ? "ai" : "fallback",
    });
  } catch (err) {
    console.error("Error generating AI insight:", err);
    res.status(500).json({ error: "Error generating insight" });
  }
};
