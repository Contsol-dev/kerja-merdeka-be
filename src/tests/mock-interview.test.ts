import request from "supertest";
import app from "../app";

const userId = "cmejpc7dg0000tgiojc22re3s"; // replace with actual user ID
const jobDataId = "cmejpc7ek000atgioq8x0tvdz"; // replace with actual job data ID

describe("POST /api/interview/start -> /api/interview/answer", () => {
  it("should generate initial interview question", async () => {
    const res = await request(app).post("/api/interview/start").send({
      userId: userId,
      jobDataId: jobDataId,
    });

    console.log("Response:\n", res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("question");
  }, 15000);

  it("should generate next question/response", async () => {
    const res = await request(app).post("/api/interview/answer").send({
      jobDataId: jobDataId,
      answer:
        "One challenging backend problem I encountered was optimizing a slow-performing database query at Tech Solutions. I analyzed the query execution plan, identified inefficient joins, and added proper indexing. After implementing these changes, the query performance improved significantly, reducing response time by over 70%.",
    });

    console.log("Response:\n", res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("question");
  }, 15000);
});

describe("GET /api/interview/logs/:jobDataId", () => {
  it("should return existing interview logs", async () => {
    const res = await request(app).get(`/api/interview/logs/${jobDataId}`);

    console.log("Response:\n", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});

describe("POST /api/interview (invalid)", () => {
  it("should fail if user not found", async () => {
    const res = await request(app).post("/api/interview/start").send({
      userId: "invalid-user",
      jobDataId: "invalid-job",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
