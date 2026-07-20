import axios from "axios";

const TOKEN_KEY = "authToken";

// Single axios instance so the base URL only lives in one place.
// Locally this defaults to localhost:5000. In production, set
// VITE_API_URL (e.g. in Vercel's project settings) to your deployed
// backend's URL — see the "Deployment" section in the README.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach the JWT (if we have one) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is missing/expired, the backend returns 401 — bounce back
// to the login screen by clearing the stored token and reloading. A full
// reload is a deliberately simple choice here over a router redirect.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

/* -------------------- AUTH -------------------- */
export const register = (email, password) =>
  api.post("/auth/register", { email, password }).then((res) => res.data);

export const login = (email, password) =>
  api.post("/auth/login", { email, password }).then((res) => res.data);

export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
export const getToken = () => localStorage.getItem(TOKEN_KEY);

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

export const getAiInsight = () =>
  api.get("/analytics/ai-insight").then((res) => res.data);

export default api;
