import {
  InsertCvEducationReq,
  InsertCvExperienceReq,
  InsertCvPersonalReq,
  InsertCvSkillReq,
} from "../interfaces/dto.interface";
import { AuthRequest } from "../interfaces/interface";
import logger from "../lib/logger";
import prisma from "../lib/prisma";
import { ApiError } from "../middlewares/error-handler.middleware";

export class UserService {
  checkCurrentUser(req: AuthRequest) {
    const userId = req.user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized: User ID not found");

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
      logger.error(`Error inserting CV personal data: ${error.message}`);
      throw error;
    }
  }

  async insertCvExperience(userId: string, data: InsertCvExperienceReq[]) {
    try {
      const experiences = await prisma.$transaction(async (tx) => {
        await tx.experience.deleteMany({ where: { userId } });

        return await tx.experience.createManyAndReturn({
          data: data.map((exp: InsertCvExperienceReq) => ({
            userId,
            ...exp,
          })),
        });
      });

      return experiences;
    } catch (error: any) {
      logger.error(`Error inserting CV experience data: ${error.message}`);
      throw error;
    }
  }

  async insertCvEducation(userId: string, data: InsertCvEducationReq[]) {
    try {
      const educations = await prisma.$transaction(async (tx) => {
        await tx.education.deleteMany({ where: { userId } });

        return await tx.education.createManyAndReturn({
          data: data.map((edu: InsertCvEducationReq) => ({
            userId,
            ...edu,
          })),
        });
      });

      return educations;
    } catch (error: any) {
      logger.error(`Error inserting CV education data: ${error.message}`);
      throw error;
    }
  }

  async insertCvSkill(userId: string, data: InsertCvSkillReq[]) {
    try {
      const skills = await prisma.$transaction(async (tx) => {
        await tx.skill.deleteMany({ where: { userId } });

        return await tx.skill.createManyAndReturn({
          data: data.map((skill: InsertCvSkillReq) => ({
            userId,
            ...skill,
          })),
        });
      });

      return skills;
    } catch (error: any) {
      logger.error(`Error inserting CV skill data: ${error.message}`);
      throw error;
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

      if (!user) throw new ApiError(404, "User not found");

      return user;
    } catch (error: any) {
      logger.error(`Error fetching user data: ${error.message}`);
      throw new ApiError(500, `Error fetching user data: ${error.message}`);
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

      if (!user) throw new ApiError(404, "User not found");

      return user;
    } catch (error: any) {
      logger.error(`Error fetching user job data: ${error.message}`);
      throw error;
    }
  }

  async getUserGeneratedData(userId: string, jobDataId: string) {
    try {
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

      if (!user) throw new ApiError(404, "User not found");
      if (user.jobs.length === 0)
        throw new ApiError(404, "Job data not found for the user");
      if (user.jobs[0].results === null)
        throw new ApiError(404, "User generated data not found");

      return user;
    } catch (error: any) {
      logger.error(`Error fetching user generated data: ${error.message}`);
      throw error;
    }
  }
}
