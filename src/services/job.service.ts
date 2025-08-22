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
      throw new ApiError(500, "Internal Server Error");
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
      throw new ApiError(500, "Internal Server Error");
    }
  }
}
