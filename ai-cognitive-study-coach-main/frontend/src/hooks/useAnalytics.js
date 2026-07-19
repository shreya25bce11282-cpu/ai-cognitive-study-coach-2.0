import { useEffect, useState } from "react";
import {
  getSummary,
  getBestStudyTime,
  getBurnoutRisk,
  getBreakRecommendation,
  predictSessionDuration,
} from "../services/api";

// Fetches every dashboard analytics endpoint in parallel and hands back
// { data, loading, error, refetch } so any page can render the same numbers.
export default function useAnalytics(subject = "Math") {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summary, bestTime, burnout, breakRec, prediction] = await Promise.all([
        getSummary(),
        getBestStudyTime(),
        getBurnoutRisk(),
        getBreakRecommendation(),
        predictSessionDuration(subject),
      ]);

      setData({ summary, bestTime, burnout, breakRec, prediction });
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  return { data, loading, error, refetch: fetchAll };
}
