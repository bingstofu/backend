import "dotenv/config";
import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

// Ensure process.env.JWT_SECRET is defined for both tests and auth middleware
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

import { app } from "../src/app";

// Mock MongoDB connection so tests run without a database
vi.mock("../src/config/db", () => ({
  connectDB: async () => {},
}));

function tokenFor(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "5m",
  });
}

describe("POST /api/ai", () => {
  it("answers 401 when there is no token", async () => {
    const res = await request(app)
      .post("/api/ai")
      .send({ prompt: "A course submission tracker built with React." });

    expect(res.status).toBe(401);
  });

  it("answers 401 when the token was signed with another secret", async () => {
    const forged = jwt.sign({ userId: "someone" }, "not-the-secret");

    const res = await request(app)
      .post("/api/ai")
      .set("Authorization", `Bearer ${forged}`)
      .send({ prompt: "A course submission tracker built with React." });

    expect(res.status).toBe(401);
  });

  it("lets a valid token through, then checks the body", async () => {
    const res = await request(app)
      .post("/api/ai")
      .set("Authorization", `Bearer ${tokenFor("test-user")}`)
      .send({ prompt: "Too short" });

    expect(res.status).toBe(400);
  });
});