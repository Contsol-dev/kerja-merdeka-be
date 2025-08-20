import request from "supertest";
import app from "../app";

describe("POST /api/generate-doc", () => {
  it("should generate CV and Cover Letter for user", async () => {
    const res = await request(app).post("/api/generate-doc").send({
      userId: "cmejec9fp0000tgasq66f99sh", // replace with actual user ID
      jobDataId: "cmejec9gs000atgashnpg0d6f", // replace with actual job data ID
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("cvText");
    expect(res.body.data).toHaveProperty("coverLetter");
    expect(res.body.data).toHaveProperty("summary");
  }, 15000);

  it("should fail if user not found", async () => {
    const res = await request(app).post("/api/generate-doc").send({
      userId: "invalid-user",
      jobDataId: "invalid-job",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
