import express from "express";
import { getSessions, startSession, endSession } from "../controllers/sessionController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { startSessionSchema, endSessionSchema } from "../validation/schemas.js";

const router = express.Router();

router.get("/sessions", authenticateToken, getSessions);
router.post("/sessions/start", authenticateToken, validateBody(startSessionSchema), startSession);
router.post("/sessions/end", authenticateToken, validateBody(endSessionSchema), endSession);

export default router;
