import request from "supertest";
import app from "../app";

describe("POST /api/interview/start", () => {
  it("should generate initial interview question", async () => {
    const res = await request(app).post("/api/interview/start").send({
      userId: "cmejec9fp0000tgasq66f99sh", // replace with actual user ID
      jobDataId: "cmejec9gs000atgashnpg0d6f", // replace with actual job data ID
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("question");
  }, 15000);

  it("should fail if user not found", async () => {
    const res = await request(app).post("/api/interview/start").send({
      userId: "invalid-user",
      jobDataId: "invalid-job",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
