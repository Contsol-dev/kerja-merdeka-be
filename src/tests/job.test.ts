import request from "supertest";
import app from "../app";
import { InsertJobDataReq } from "../interfaces/dto.interface";

describe("JOB ENDPOINT", () => {
  const testUser = {
    email: "testuser@example.com",
    password: "password123",
  };

  let token: string;
  let userId: string;

  it("should login with valid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
    userId = res.body.user.id;
  });

  const jobData: InsertJobDataReq[] = [
    {
      link: "https://example.com/job/123",
      jobTitle: "Software Engineer",
      company: "Tech Company",
      location: "Remote",
      description: "Develop and maintain web applications",
      deadline: new Date("2023-12-31"),
    },
    {
      link: "https://example.com/job/456",
      jobTitle: "Senior Software Engineer",
      company: "Another Tech Company",
      location: null,
      description: null,
      deadline: null,
    },
  ];

  it("should insert job data 1", async () => {
    const res = await request(app)
      .post("/api/job")
      .auth(token, { type: "bearer" })
      .send(jobData[0]);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data).toHaveProperty("userId", userId);
    expect(res.body.data).toHaveProperty("link", jobData[0].link);
    expect(res.body.data).toHaveProperty("jobTitle", jobData[0].jobTitle);
    expect(res.body.data).toHaveProperty("company", jobData[0].company);
    expect(res.body.data).toHaveProperty("location", jobData[0].location);
    expect(res.body.data).toHaveProperty("description", jobData[0].description);
    expect(res.body.data).toHaveProperty(
      "deadline",
      jobData[0].deadline?.toISOString() || null
    );
  });

  let jobId: string;

  it("should insert job data 2", async () => {
    const res = await request(app)
      .post("/api/job")
      .auth(token, { type: "bearer" })
      .send(jobData[1]);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data).toHaveProperty("userId", userId);
    expect(res.body.data).toHaveProperty("link", jobData[1].link);
    expect(res.body.data).toHaveProperty("jobTitle", jobData[1].jobTitle);
    expect(res.body.data).toHaveProperty("company", jobData[1].company);
    expect(res.body.data).toHaveProperty("location", jobData[1].location);
    expect(res.body.data).toHaveProperty("description", jobData[1].description);
    expect(res.body.data).toHaveProperty(
      "deadline",
      jobData[1].deadline?.toISOString() || null
    );
    jobId = res.body.data.id;
  });

  it("should get job list", async () => {
    const res = await request(app)
      .get("/api/job")
      .auth(token, { type: "bearer" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data).toHaveLength(jobData.length);
  });

  it("should update job data 1", async () => {
    const res = await request(app)
      .put(`/api/job/${jobId}`)
      .auth(token, { type: "bearer" })
      .send({
        ...jobData[0],
        jobTitle: "Updated Software Engineer",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id", jobId);
    expect(res.body.data).toHaveProperty(
      "jobTitle",
      "Updated Software Engineer"
    );
  });

  it("should get job data 1", async () => {
    const res = await request(app)
      .get(`/api/job/${jobId}`)
      .auth(token, { type: "bearer" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id", jobId);
    expect(res.body.data).toHaveProperty(
      "jobTitle",
      "Updated Software Engineer"
    );
  });

  it("should delete job data 1", async () => {
    const res = await request(app)
      .delete(`/api/job/${jobId}`)
      .auth(token, { type: "bearer" });

    expect(res.statusCode).toBe(204);
    expect(res.body.success).toBe(true);
  });
});
