import express from "express";
import { register, login } from "../controllers/authController.js";
import { validateBody } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validation/schemas.js";

const router = express.Router();

router.post("/auth/register", validateBody(registerSchema), register);
router.post("/auth/login", validateBody(loginSchema), login);

export default router;
