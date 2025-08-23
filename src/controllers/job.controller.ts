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

  static async getJobData(req: AuthRequest, res: Response) {
    const userId = userService.checkCurrentUser(req);
    const { jobDataId } = req.params;

    logger.info(
      `(GET JOB) - User ID: ${userId}, Job Data ID: ${jobDataId} Attempting to retrieve job data`
    );

    const jobData = await jobService.getJobData(userId, jobDataId);

    logger.info(
      `(GET JOB) - User ID: ${userId}, Job Data ID: ${jobDataId} Successfully retrieved job data`
    );

    res.status(200).json({
      success: true,
      data: jobData,
    });
  }

  static async updateJobData(req: AuthRequest, res: Response) {
    const userId = userService.checkCurrentUser(req);
    const { jobDataId } = req.params;
    const updateData: Partial<InsertJobDataReq> = req.body;

    logger.info(
      `(UPDATE JOB) - User ID: ${userId}, Job Data ID: ${jobDataId} Attempting to update job data`
    );

    const updatedJobData = await jobService.updateJobData(
      userId,
      jobDataId,
      updateData
    );

    logger.info(
      `(UPDATE JOB) - User ID: ${userId}, Job Data ID: ${jobDataId} Successfully updated job data`
    );

    res.status(200).json({
      success: true,
      data: updatedJobData,
    });
  }

  static async deleteJobData(req: AuthRequest, res: Response) {
    const userId = userService.checkCurrentUser(req);
    const { jobDataId } = req.params;

    logger.info(
      `(DELETE JOB) - User ID: ${userId}, Job Data ID: ${jobDataId} Attempting to delete job data`
    );

    await jobService.deleteJobData(userId, jobDataId);

    logger.info(
      `(DELETE JOB) - User ID: ${userId}, Job Data ID: ${jobDataId} Successfully deleted job data`
    );

    res.status(204).send();
  }
}
