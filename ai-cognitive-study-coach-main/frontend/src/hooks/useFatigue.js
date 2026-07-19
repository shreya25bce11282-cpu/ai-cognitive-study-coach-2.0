import { useEffect, useState } from "react";
import { getSessions, getFatigue } from "../services/api";

// The backend only exposes one aggregate fatigue number (getFatigue), not a
// day-by-day series. To feed the LineChart in Fatigue.jsx, we pull the raw
// session list and group fatigue ratings by calendar day ourselves.
function toDailySeries(sessions) {
  const byDay = {};

  sessions
    .filter((s) => s.fatigue_rating != null && s.start_time)
    .forEach((s) => {
      const day = new Date(s.start_time).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!byDay[day]) byDay[day] = { total: 0, count: 0 };
      byDay[day].total += Number(s.fatigue_rating);
      byDay[day].count += 1;
    });

  return Object.entries(byDay)
    .map(([day, { total, count }]) => ({
      day,
      fatigue: Number((total / count).toFixed(2)),
    }))
    // sessions come back newest-first; flip so the chart reads left-to-right chronologically
    .reverse();
}

export function useFatigue() {
  const [data, setData] = useState([]);
  const [aggregate, setAggregate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFatigue = async () => {
      setLoading(true);
      setError(null);
      try {
        const [sessions, fatigueSummary] = await Promise.all([
          getSessions(),
          getFatigue(),
        ]);
        setData(toDailySeries(sessions));
        setAggregate(fatigueSummary);
      } catch (err) {
        console.error("Error fetching fatigue data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFatigue();
  }, []);

  return { data, aggregate, loading, error };
}
