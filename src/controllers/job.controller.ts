import { Response } from "express";
import { AuthRequest } from "../interfaces/interface";
import { JobService } from "../services/job.service";
import { UserService } from "../services/user.service";
import { InsertJobDataReq } from "../interfaces/dto.interface";

const jobService = new JobService();
const userService = new UserService();

export class JobController {
  static async insertJobData(req: AuthRequest, res: Response) {
    try {
      const userId = userService.checkCurrentUser(req);
      const jobData: InsertJobDataReq = req.body;

      const newJobData = await jobService.insertJobData(userId, jobData);

      res.status(201).json({
        success: true,
        data: newJobData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  static async getJobList(req: AuthRequest, res: Response) {
    try {
      const userId = userService.checkCurrentUser(req);

      const jobList = await jobService.getJobList(userId);

      res.status(200).json({
        success: true,
        data: jobList,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
}
