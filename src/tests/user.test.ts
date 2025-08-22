import request from "supertest";
import app from "../app";
import {
  InsertCvEducationReq,
  InsertCvExperienceReq,
  InsertCvPersonalReq,
  InsertCvSkillReq,
} from "../interfaces/dto.interface";

describe("USER ENDPOINT", () => {
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

  const userPersonal: InsertCvPersonalReq = {
    email: "testuser@example.com",
    phone: "1234567890",
    name: "Test User",
    address: null,
    linkedin: null,
    portfolio: null,
  };

  it("should insert user personal data", async () => {
    const res = await request(app)
      .post("/api/user/personal")
      .auth(token, { type: "bearer" })
      .send(userPersonal);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id", userId);
    expect(res.body.data).toHaveProperty("email", userPersonal.email);
    expect(res.body.data).toHaveProperty("phone", userPersonal.phone);
    expect(res.body.data).toHaveProperty("name", userPersonal.name);
    expect(res.body.data).toHaveProperty("address", userPersonal.address);
    expect(res.body.data).toHaveProperty("linkedin", userPersonal.linkedin);
    expect(res.body.data).toHaveProperty("portfolio", userPersonal.portfolio);
  });

  // ACTIVATE AFTER INPUT VALIDATION
  /* it("should fail to insert user personal data with invalid input", async () => {
    const invalidPersonal = { ...userPersonal, email: "invalid-email" };
    const res = await request(app)
      .post("/api/user/personal")
      .auth(token, { type: "bearer" })
      .send(invalidPersonal);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  }); */

  const userExperiences: InsertCvExperienceReq[] = [
    {
      title: "Software Engineer",
      company: "Tech Company",
      type: "WORK",
      status: "CONTRACT",
      startDate: new Date("2020-01-01"),
      endDate: new Date("2021-01-01"),
      description: "Developed web applications",
    },
    {
      title: "Senior Software Engineer",
      company: "Another Tech Company",
      type: "WORK",
      status: "FULL_TIME",
      startDate: new Date("2021-02-01"),
      endDate: null,
      description: null,
    },
  ];

  it("should insert user experiences data", async () => {
    const res = await request(app)
      .post("/api/user/experience")
      .auth(token, { type: "bearer" })
      .send(userExperiences);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
    res.body.data.forEach((exp: any, index: number) => {
      expect(exp).toHaveProperty("id");
      expect(exp).toHaveProperty("userId", userId);
      expect(exp).toHaveProperty("title", userExperiences[index].title);
      expect(exp).toHaveProperty("company", userExperiences[index].company);
      expect(exp).toHaveProperty("type", userExperiences[index].type);
      expect(exp).toHaveProperty("status", userExperiences[index].status);
      expect(exp).toHaveProperty(
        "startDate",
        userExperiences[index].startDate.toISOString()
      );
      expect(exp).toHaveProperty(
        "endDate",
        userExperiences[index].endDate?.toISOString() || null
      );
      expect(exp).toHaveProperty(
        "description",
        userExperiences[index].description
      );
    });
  });

  it("should fail to insert user experiences data with missing fields", async () => {
    const invalidExperience = [{ ...userExperiences[0], title: undefined }];
    const res = await request(app)
      .post("/api/user/experience")
      .auth(token, { type: "bearer" })
      .send(invalidExperience);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  });

  const userEducations: InsertCvEducationReq[] = [
    {
      degree: "Bachelor's Degree",
      fieldOfStudy: "Computer Science",
      institution: "University A",
      startDate: new Date("2016-01-01"),
      endDate: new Date("2020-01-01"),
    },
    {
      degree: "Master's Degree",
      fieldOfStudy: "Software Engineering",
      institution: "University B",
      startDate: new Date("2020-02-01"),
      endDate: null,
    },
  ];

  it("should insert user educations data", async () => {
    const res = await request(app)
      .post("/api/user/education")
      .auth(token, { type: "bearer" })
      .send(userEducations);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
    res.body.data.forEach((edu: any, index: number) => {
      expect(edu).toHaveProperty("id");
      expect(edu).toHaveProperty("userId", userId);
      expect(edu).toHaveProperty("degree", userEducations[index].degree);
      expect(edu).toHaveProperty(
        "fieldOfStudy",
        userEducations[index].fieldOfStudy
      );
      expect(edu).toHaveProperty(
        "institution",
        userEducations[index].institution
      );
      expect(edu).toHaveProperty(
        "startDate",
        userEducations[index].startDate.toISOString()
      );
      expect(edu).toHaveProperty(
        "endDate",
        userEducations[index].endDate?.toISOString() || null
      );
    });
  });

  it("should fail to insert user educations data with invalid dates", async () => {
    const invalidEducation = [
      { ...userEducations[0], startDate: "invalid-date" },
    ];
    const res = await request(app)
      .post("/api/user/education")
      .auth(token, { type: "bearer" })
      .send(invalidEducation);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  });

  const userSkills: InsertCvSkillReq[] = [
    {
      name: "JavaScript",
      level: "BEGINNER",
    },
    {
      name: "TypeScript",
      level: "INTERMEDIATE",
    },
    {
      name: "Node.js",
      level: "SPECIALIST",
    },
  ];

  it("should insert user skills data", async () => {
    const res = await request(app)
      .post("/api/user/skills")
      .auth(token, { type: "bearer" })
      .send(userSkills);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(3);
    res.body.data.forEach((skill: any, index: number) => {
      expect(skill).toHaveProperty("id");
      expect(skill).toHaveProperty("userId", userId);
      expect(skill).toHaveProperty("name", userSkills[index].name);
      expect(skill).toHaveProperty("level", userSkills[index].level);
    });
  });

  it("should fail to insert user skills data with invalid level", async () => {
    const invalidSkills = [{ ...userSkills[0], level: "INVALID_LEVEL" }];
    const res = await request(app)
      .post("/api/user/skills")
      .auth(token, { type: "bearer" })
      .send(invalidSkills);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  });

  it("should return user data including personal, experiences, educations, and skills information", async () => {
    const res = await request(app)
      .get("/api/user")
      .auth(token, { type: "bearer" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const data = res.body.data;

    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("email");
    expect(data).toHaveProperty("name");
    expect(data).toHaveProperty("phone");
    expect(data).toHaveProperty("address");
    expect(data).toHaveProperty("linkedin");
    expect(data).toHaveProperty("portfolio");
    expect(data).toHaveProperty("createdAt");
    expect(data).toHaveProperty("updatedAt");

    expect(Array.isArray(data.educations)).toBe(true);
    data.educations.forEach((edu: any) => {
      expect(edu).toHaveProperty("id");
      expect(edu).toHaveProperty("userId");
      expect(edu).toHaveProperty("degree");
      expect(edu).toHaveProperty("fieldOfStudy");
      expect(edu).toHaveProperty("institution");
      expect(edu).toHaveProperty("startDate");
      expect(edu).toHaveProperty("endDate");
    });

    expect(Array.isArray(data.experiences)).toBe(true);
    data.experiences.forEach((exp: any) => {
      expect(exp).toHaveProperty("id");
      expect(exp).toHaveProperty("type");
      expect(exp).toHaveProperty("userId");
      expect(exp).toHaveProperty("company");
      expect(exp).toHaveProperty("description");
      expect(exp).toHaveProperty("startDate");
      expect(exp).toHaveProperty("endDate");
      expect(exp).toHaveProperty("status");
      expect(exp).toHaveProperty("title");
    });

    expect(Array.isArray(data.skills)).toBe(true);
    data.skills.forEach((skill: any) => {
      expect(skill).toHaveProperty("id");
      expect(skill).toHaveProperty("name");
      expect(skill).toHaveProperty("userId");
      expect(skill).toHaveProperty("level");
    });
  });
});
