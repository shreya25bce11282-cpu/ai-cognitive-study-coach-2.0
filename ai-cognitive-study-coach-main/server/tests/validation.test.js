import { describe, test, expect } from "@jest/globals";
import {
  registerSchema,
  loginSchema,
  startSessionSchema,
  endSessionSchema,
} from "../src/validation/schemas.js";

describe("registerSchema", () => {
  test("accepts a valid email and password", () => {
    const result = registerSchema.safeParse({ email: "a@b.com", password: "password123" });
    expect(result.success).toBe(true);
  });

  test("rejects an invalid email", () => {
    const result = registerSchema.safeParse({ email: "not-an-email", password: "password123" });
    expect(result.success).toBe(false);
  });

  test("rejects a short password", () => {
    const result = registerSchema.safeParse({ email: "a@b.com", password: "short" });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  test("accepts valid credentials", () => {
    const result = loginSchema.safeParse({ email: "a@b.com", password: "anything" });
    expect(result.success).toBe(true);
  });

  test("rejects an empty password", () => {
    const result = loginSchema.safeParse({ email: "a@b.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("startSessionSchema", () => {
  test("accepts a valid subject", () => {
    const result = startSessionSchema.safeParse({ subject: "Math" });
    expect(result.success).toBe(true);
  });

  test("rejects an empty subject", () => {
    const result = startSessionSchema.safeParse({ subject: "" });
    expect(result.success).toBe(false);
  });

  test("rejects a missing subject", () => {
    const result = startSessionSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("endSessionSchema", () => {
  test("accepts valid ratings", () => {
    const result = endSessionSchema.safeParse({ session_id: 1, fatigue_rating: 3, focus_rating: 4 });
    expect(result.success).toBe(true);
  });

  test("rejects a rating above 5", () => {
    const result = endSessionSchema.safeParse({ session_id: 1, fatigue_rating: 6, focus_rating: 4 });
    expect(result.success).toBe(false);
  });

  test("rejects a rating below 1", () => {
    const result = endSessionSchema.safeParse({ session_id: 1, fatigue_rating: 0, focus_rating: 4 });
    expect(result.success).toBe(false);
  });

  test("rejects a non-integer session_id", () => {
    const result = endSessionSchema.safeParse({ session_id: 1.5, fatigue_rating: 3, focus_rating: 4 });
    expect(result.success).toBe(false);
  });
});
