import { describe, test, expect, jest, beforeEach } from "@jest/globals";

// Mock the db pool before importing the controller, so no real Postgres
// connection is needed to test the controller's logic.
const mockQuery = jest.fn();
jest.unstable_mockModule("../src/db/db.js", () => ({
  default: { query: mockQuery },
}));

const { getSessions, startSession, endSession } = await import("../src/controllers/sessionController.js");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => {
  mockQuery.mockReset();
});

describe("getSessions", () => {
  test("scopes the query to req.userId and returns rows", async () => {
    mockQuery.mockResolvedValue({ rows: [{ id: 1, subject: "Math" }] });
    const req = { userId: 7 };
    const res = mockRes();

    await getSessions(req, res);

    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("WHERE user_id = $1"), [7]);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, subject: "Math" }]);
  });
});

describe("startSession", () => {
  test("inserts with the authenticated user's id and the given subject", async () => {
    mockQuery.mockResolvedValue({ rows: [{ id: 5, user_id: 7, subject: "DSA" }] });
    const req = { userId: 7, body: { subject: "DSA" } };
    const res = mockRes();

    await startSession(req, res);

    expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [7, "DSA"]);
    expect(res.json).toHaveBeenCalledWith({ id: 5, user_id: 7, subject: "DSA" });
  });
});

describe("endSession", () => {
  test("returns 404 when the session doesn't belong to this user", async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });
    const req = { userId: 7, body: { session_id: 999, fatigue_rating: 3, focus_rating: 4 } };
    const res = mockRes();

    await endSession(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("updates and returns the session when it belongs to this user", async () => {
    mockQuery.mockResolvedValue({ rows: [{ id: 5, fatigue_rating: 3, focus_rating: 4 }], rowCount: 1 });
    const req = { userId: 7, body: { session_id: 5, fatigue_rating: 3, focus_rating: 4 } };
    const res = mockRes();

    await endSession(req, res);

    expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [3, 4, 5, 7]);
    expect(res.json).toHaveBeenCalledWith({ id: 5, fatigue_rating: 3, focus_rating: 4 });
  });
});
