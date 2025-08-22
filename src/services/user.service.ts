import {
  InsertCvEducationReq,
  InsertCvExperienceReq,
  InsertCvPersonalReq,
  InsertCvSkillReq,
} from "../interfaces/dto.interface";
import { AuthRequest } from "../interfaces/interface";
import prisma from "../lib/prisma";

export class UserService {
  checkCurrentUser(req: AuthRequest) {
    const userId = req.user?.userId;
    if (!userId) throw new Error("Unauthorized: User ID not found");

    return userId;
  }
  async insertCvPersonal(userId: string, data: InsertCvPersonalReq) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          ...data,
        },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        linkedin: user.linkedin,
        portfolio: user.portfolio,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async insertCvExperience(userId: string, data: InsertCvExperienceReq[]) {
    try {
      const experiences = await prisma.experience.createManyAndReturn({
        data: data.map((exp: InsertCvExperienceReq) => ({
          userId,
          ...exp,
        })),
      });

      return experiences;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async insertCvEducation(userId: string, data: InsertCvEducationReq[]) {
    try {
      const educations = await prisma.education.createManyAndReturn({
        data: data.map((edu: InsertCvEducationReq) => ({
          userId,
          ...edu,
        })),
      });

      return educations;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async insertCvSkill(userId: string, data: InsertCvSkillReq[]) {
    try {
      const skills = await prisma.skill.createManyAndReturn({
        data: data.map((skill: InsertCvSkillReq) => ({
          userId,
          ...skill,
        })),
      });

      return skills;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getUserData(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          educations: true,
          experiences: true,
          skills: true,
        },
      });

      if (!user) throw new Error("User not found");

      return user;
    } catch (error: any) {
      throw new Error(`Error fetching user data: ${error.message}`);
    }
  }

  async getUserJobData(userId: string, jobDataId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          educations: true,
          experiences: true,
          skills: true,
          jobs: {
            where: { id: jobDataId },
          },
        },
      });

      if (!user) throw new Error("User not found");

      return user;
    } catch (error: any) {
      throw new Error(`Error fetching user job data: ${error.message}`);
    }
  }

  async getUserGeneratedData(userId: string, jobDataId: string) {
    console.log("Fetching user generated data...");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        educations: true,
        experiences: true,
        skills: true,
        jobs: {
          where: { id: jobDataId },
          include: {
            results: true,
          },
        },
      },
    });

    if (!user) throw new Error("User not found");
    if (user.jobs.length === 0)
      throw new Error("Job data not found for the user");
    if (user.jobs[0].results === null)
      throw new Error("User generated data not found");

    console.log("User generated data fetched successfully");

    return user;
  }
}
