import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Must be a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Must be a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const startSessionSchema = z.object({
  subject: z.string().trim().min(1, "Subject is required").max(100, "Subject is too long"),
});

export const endSessionSchema = z.object({
  session_id: z.number().int().positive("session_id must be a positive integer"),
  fatigue_rating: z.number().int().min(1).max(5, "fatigue_rating must be between 1 and 5"),
  focus_rating: z.number().int().min(1).max(5, "focus_rating must be between 1 and 5"),
});
