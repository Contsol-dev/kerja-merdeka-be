import { InsertJobDataReq } from "../interfaces/dto.interface";
import logger from "../lib/logger";
import prisma from "../lib/prisma";
import { ApiError } from "../middlewares/error-handler.middleware";

export class JobService {
  async insertJobData(userId: string, data: InsertJobDataReq) {
    try {
      const job = await prisma.jobData.create({
        data: {
          userId,
          ...data,
        },
      });

      return job;
    } catch (error: any) {
      logger.error(`Error inserting job data: ${error.message}`);
      throw error;
    }
  }

  async getJobList(userId: string) {
    try {
      const jobList = await prisma.jobData.findMany({
        where: { userId },
      });

      return jobList;
    } catch (error: any) {
      logger.error(`Error fetching job list: ${error.message}`);
      throw error;
    }
  }

  async getJobData(userId: string, jobDataId: string) {
    try {
      const job = await prisma.jobData.findUnique({
        where: { id: jobDataId, userId },
      });

      if (!job) throw new ApiError(404, "Data Lowongan tidak ditemukan");

      return job;
    } catch (error: any) {
      logger.error(`Error fetching job data: ${error.message}`);
      throw error;
    }
  }

  async updateJobData(
    userId: string,
    jobDataId: string,
    data: Partial<InsertJobDataReq>
  ) {
    try {
      const job = await prisma.jobData.update({
        where: { id: jobDataId, userId },
        data,
      });

      return job;
    } catch (error: any) {
      logger.error(`Error updating job data: ${error.message}`);
      throw error;
    }
  }

  async deleteJobData(userId: string, jobDataId: string) {
    try {
      await prisma.jobData.delete({
        where: { id: jobDataId, userId },
      });
    } catch (error: any) {
      logger.error(`Error deleting job data: ${error.message}`);
      throw error;
    }
  }
}
