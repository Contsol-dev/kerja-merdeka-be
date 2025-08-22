import request from "supertest";
import app from "../app";
import {
  InsertCvEducationReq,
  InsertCvExperienceReq,
  InsertCvPersonalReq,
  InsertCvSkillReq,
  InsertJobDataReq,
} from "../interfaces/dto.interface";

describe("END-TO-END TEST", () => {
  const testUser = {
    name: "John Doe",
    email: "iqbal.gozy@gmail.com",
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
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("name");
    expect(res.body.user).toHaveProperty("email", testUser.email);
    token = res.body.token;
    userId = res.body.user.id;
  });

  const userPersonal: InsertCvPersonalReq = {
    email: "iqbal.gozy@gmail.com",
    phone: "1234567890",
    name: "John Doe",
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

  const userExperiences: InsertCvExperienceReq[] = [
    {
      title: "Junior Developer",
      company: "Startup Inc.",
      type: "WORK",
      status: "FULL_TIME",
      startDate: new Date("2018-06-01"),
      endDate: new Date("2019-12-31"),
      description: "Assisted in developing and maintaining web applications",
    },
    {
      title: "Software Engineer",
      company: "Tech Innovators",
      type: "WORK",
      status: "FULL_TIME",
      startDate: new Date("2020-01-01"),
      endDate: null,
      description: "Led the development of scalable backend systems",
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

  const userEducations: InsertCvEducationReq[] = [
    {
      degree: "Bachelor's Degree",
      fieldOfStudy: "Information Technology",
      institution: "Institute of Technology C",
      startDate: new Date("2015-08-01"),
      endDate: new Date("2019-05-01"),
    },
    {
      degree: "Master's Degree",
      fieldOfStudy: "Artificial Intelligence",
      institution: "University D",
      startDate: new Date("2019-09-01"),
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

  const jobData: InsertJobDataReq[] = [
    {
      link: "https://example.com/job/789",
      jobTitle: "Frontend Developer",
      company: "Creative Agency",
      location: "On-site",
      description: "Design and implement user interfaces",
      deadline: new Date("2024-01-15"),
    },
    {
      link: "https://example.com/job/101",
      jobTitle: "Backend Developer",
      company: "Enterprise Solutions",
      location: "Hybrid",
      description: "Build and optimize server-side applications",
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

  it("should generate initial interview question", async () => {
    const res = await request(app)
      .post(`/api/interview/start/${jobId}`)
      .auth(token, { type: "bearer" })
      .send();

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("question");
  }, 15000);

  it("should generate next question/response 1", async () => {
    const res = await request(app)
      .post(`/api/interview/answer/${jobId}`)
      .auth(token, { type: "bearer" })
      .send({
        answer:
          "One challenging backend problem I encountered was optimizing a slow-performing database query at Tech Innovators. I analyzed the query execution plan, identified inefficient joins, and added proper indexing. After implementing these changes, the query performance improved significantly, reducing response time by over 70%.",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("question");
  }, 15000);

  it("should generate next question/response 2", async () => {
    const res = await request(app)
      .post(`/api/interview/answer/${jobId}`)
      .auth(token, { type: "bearer" })
      .send({
        answer:
          "My experience in leading the development of scalable backend systems at Tech Innovators, combined with my ability to optimize performance and collaborate with diverse teams, aligns well with the requirements of this role. I am committed to leveraging my skills to deliver impactful solutions and contribute to the success of your organization.",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("question");
  }, 15000);

  it("should generate next question/response 3", async () => {
    const res = await request(app)
      .post(`/api/interview/answer/${jobId}`)
      .auth(token, { type: "bearer" })
      .send({
        answer:
          "I am eager to bring my experience in developing scalable backend systems and optimizing performance to your team. Thank you for considering my application, and I look forward to contributing to the success of Creative Agency.",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("question");
  }, 15000);

  it("should return existing interview logs", async () => {
    const res = await request(app)
      .get(`/api/interview/logs/${jobId}`)
      .auth(token, { type: "bearer" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("should return interview feedback", async () => {
    const res = await request(app)
      .get(`/api/interview/feedback/${jobId}`)
      .auth(token, { type: "bearer" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("feedback");
    expect(res.body.data).toHaveProperty("score");
  }, 15000);

  it("should generate CV PDF", async () => {
    const res = await request(app)
      .get(`/api/doc/${jobId}?result=cv`)
      .auth(token, { type: "bearer" });

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toBe("application/pdf");
    expect(res.headers["content-disposition"]).toContain("cv-");
    expect(res.body).toBeInstanceOf(Buffer);
  }, 30000);

  it("should generate Cover Letter PDF", async () => {
    const res = await request(app)
      .get(`/api/doc/${jobId}?result=cover-letter`)
      .auth(token, { type: "bearer" });

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toBe("application/pdf");
    expect(res.headers["content-disposition"]).toContain("cover-letter-");
    expect(res.body).toBeInstanceOf(Buffer);
  }, 15000);

  it("should return summary as JSON", async () => {
    const res = await request(app)
      .get(`/api/doc/${jobId}?result=summary`)
      .auth(token, { type: "bearer" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("summary");
  }, 15000);

  it("should send jobpack", async () => {
    const res = await request(app)
      .get(`/api/jobpack/${jobId}`)
      .auth(token, { type: "bearer" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("message");
    expect(res.body.data).toHaveProperty("status_code");
  }, 40000);
});
