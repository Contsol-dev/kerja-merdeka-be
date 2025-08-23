import request from "supertest";
import app from "../app";

describe("Auth Endpoints", () => {
  const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    phone: "1234567890",
    password: "password123",
    confPassword: "password123",
  };

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("email", testUser.email);
    expect(res.body.user).toHaveProperty("phone", testUser.phone);
    expect(res.body.user).toHaveProperty("name", testUser.name);
  });

  it("should not register with duplicate email", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });

  it("should login with valid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("name");
    expect(res.body.user).toHaveProperty("email", testUser.email);
  });

  it("should not login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
