import express from "express";
import {
  getFatigue,
  getOptimalSession,
  getSummary,
  getSubjectPerformance,
  getStudyPlan,
  getBurnoutRisk,
  getBreakRecommendation,
  predictSessionDuration,
  getBestStudyTime
} from "../controllers/analyticsController.js";
import { getAiInsight } from "../controllers/aiInsightController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Every analytics route needs a logged-in user, since every query is
// scoped to req.userId.
router.use(authenticateToken);

router.get("/analytics/fatigue", getFatigue);
router.get("/analytics/optimal-session", getOptimalSession);
router.get("/analytics/summary", getSummary);
router.get("/analytics/subject-performance", getSubjectPerformance);
router.get("/analytics/recommend-study-plan", getStudyPlan);
router.get("/analytics/burnout-risk", getBurnoutRisk);
router.get("/analytics/break-recommendation", getBreakRecommendation);
router.get("/analytics/predict-session", predictSessionDuration);
router.get("/analytics/best-time", getBestStudyTime);
router.get("/analytics/ai-insight", getAiInsight);

export default router;