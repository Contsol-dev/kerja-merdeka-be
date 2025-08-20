import request from "supertest";
import app from "../app";

const userId = "cmejpc7dg0000tgiojc22re3s"; // replace with actual user ID
const jobDataId = "cmejpc7ek000atgioq8x0tvdz"; // replace with actual job data ID

describe("POST /api/doc/generate", () => {
  it("should generate CV and Cover Letter for user", async () => {
    const res = await request(app).post("/api/doc/generate").send({
      userId: userId,
      jobDataId: jobDataId,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("cvText");
    expect(res.body.data).toHaveProperty("coverLetter");
    expect(res.body.data).toHaveProperty("summary");
  }, 15000);

  it("should fail if user not found", async () => {
    const res = await request(app).post("/api/doc/generate").send({
      userId: "invalid-user",
      jobDataId: "invalid-job",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
