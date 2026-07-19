import axios from "axios";

// Single axios instance so the base URL only lives in one place.
// If your backend runs somewhere other than localhost:5000, change it here.
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* -------------------- SESSIONS -------------------- */
export const getSessions = () => api.get("/sessions").then((res) => res.data);

export const startSession = (subject) =>
  api.post("/sessions/start", { subject }).then((res) => res.data);

export const endSession = (sessionId, fatigueRating, focusRating) =>
  api
    .post("/sessions/end", {
      session_id: sessionId,
      fatigue_rating: fatigueRating,
      focus_rating: focusRating,
    })
    .then((res) => res.data);

/* -------------------- ANALYTICS -------------------- */
// Route names here match server/src/routes/analyticsRoutes.js exactly.
export const getFatigue = () => api.get("/analytics/fatigue").then((res) => res.data);

export const getOptimalSession = (subject) =>
  api.get("/analytics/optimal-session", { params: { subject } }).then((res) => res.data);

export const getSummary = () => api.get("/analytics/summary").then((res) => res.data);

export const getSubjectPerformance = () =>
  api.get("/analytics/subject-performance").then((res) => res.data);

export const getStudyPlan = () =>
  api.get("/analytics/recommend-study-plan").then((res) => res.data);

export const getBurnoutRisk = () =>
  api.get("/analytics/burnout-risk").then((res) => res.data);

export const getBreakRecommendation = () =>
  api.get("/analytics/break-recommendation").then((res) => res.data);

export const predictSessionDuration = (subject) =>
  api.get("/analytics/predict-session", { params: { subject } }).then((res) => res.data);

export const getBestStudyTime = () =>
  api.get("/analytics/best-time").then((res) => res.data);

export default api;
