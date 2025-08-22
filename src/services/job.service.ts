import { InsertJobDataReq } from "../interfaces/dto.interface";
import prisma from "../lib/prisma";

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
      throw new Error(`Error inserting job data: ${error.message}`);
    }
  }

  async getJobList(userId: string) {
    try {
      const jobList = await prisma.jobData.findMany({
        where: { userId },
      });

      return jobList;
    } catch (error: any) {
      throw new Error(`Error fetching job list: ${error.message}`);
    }
  }
}
