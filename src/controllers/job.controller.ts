import { Response } from "express";
import { AuthRequest } from "../interfaces/interface";
import { JobService } from "../services/job.service";
import { UserService } from "../services/user.service";
import { InsertJobDataReq } from "../interfaces/dto.interface";
import logger from "../lib/logger";

const jobService = new JobService();
const userService = new UserService();

export class JobController {
  static async insertJobData(req: AuthRequest, res: Response) {
    const userId = userService.checkCurrentUser(req);
    const jobData: InsertJobDataReq = req.body;

    logger.info(
      `(INSERT JOB) - User ID: ${userId}, Job Data: ${jobData.jobTitle} - ${jobData.company} Attempting to insert job data`
    );

    const newJobData = await jobService.insertJobData(userId, jobData);

    logger.info(
      `(INSERT JOB) - User ID: ${userId}, Job Data: ${jobData.jobTitle} - ${jobData.company} Successfully inserted job data`
    );

    res.status(201).json({
      success: true,
      data: newJobData,
    });
  }

  static async getJobList(req: AuthRequest, res: Response) {
    const userId = userService.checkCurrentUser(req);

    logger.info(
      `(GET JOB LIST) - User ID: ${userId} Attempting to retrieve job list`
    );

    const jobList = await jobService.getJobList(userId);

    logger.info(
      `(GET JOB LIST) - User ID: ${userId} Successfully retrieved job list`
    );

    res.status(200).json({
      success: true,
      data: jobList,
    });
  }
}
