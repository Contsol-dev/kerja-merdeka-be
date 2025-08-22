import { Response } from "express";
import { MockInterviewService } from "../services/mock-interview.service";
import { AuthRequest } from "../interfaces/interface";
import { UserService } from "../services/user.service";
import logger from "../lib/logger";

const service = new MockInterviewService();
const userService = new UserService();

export const startInterview = async (req: AuthRequest, res: Response) => {
  const { jobDataId } = req.params;
  const userId = userService.checkCurrentUser(req);

  logger.info(
    `(START INTERVIEW) - User ID: ${userId}, Job Data ID: ${jobDataId} Attempting to start interview`
  );

  const result = await service.startInterview(userId, jobDataId);

  logger.info(
    `(START INTERVIEW) - User ID: ${userId}, Job Data ID: ${jobDataId} Successfully started interview`
  );

  return res.status(201).json({
    success: true,
    data: result,
  });
};

export const answerInterview = async (req: AuthRequest, res: Response) => {
  const { jobDataId } = req.params;
  const { answer } = req.body;
  const userId = userService.checkCurrentUser(req);

  logger.info(
    `(ANSWER INTERVIEW) - User ID: ${userId}, Job Data ID: ${jobDataId} Attempting to answer interview question`
  );

  await service.userJobCheck(userId, jobDataId);
  const result = await service.answerQuestion(jobDataId, answer);

  logger.info(
    `(ANSWER INTERVIEW) - User ID: ${userId}, Job Data ID: ${jobDataId} Successfully answered interview question`
  );

  return res.status(201).json({
    success: true,
    data: result,
  });
};

export const getInterviewLogs = async (req: AuthRequest, res: Response) => {
  const { jobDataId } = req.params;
  const userId = userService.checkCurrentUser(req);

  logger.info(
    `(GET INTERVIEW LOGS) - User ID: ${userId}, Job Data ID: ${jobDataId} Attempting to retrieve interview logs`
  );

  await service.userJobCheck(userId, jobDataId);
  const logs = await service.getInterviewLogs(jobDataId);

  logger.info(
    `(GET INTERVIEW LOGS) - User ID: ${userId}, Job Data ID: ${jobDataId} Successfully retrieved interview logs`
  );

  return res.status(200).json({
    success: true,
    data: logs,
  });
};

export const getInterviewFeedback = async (req: AuthRequest, res: Response) => {
  const { jobDataId } = req.params;
  const userId = userService.checkCurrentUser(req);

  logger.info(
    `(GET INTERVIEW FEEDBACK) - User ID: ${userId}, Job Data ID: ${jobDataId} Attempting to retrieve interview feedback`
  );

  await service.userJobCheck(userId, jobDataId);
  const feedback = await service.getInterviewFeedback(jobDataId);

  logger.info(
    `(GET INTERVIEW FEEDBACK) - User ID: ${userId}, Job Data ID: ${jobDataId} Successfully retrieved interview feedback`
  );

  return res.status(200).json({
    success: true,
    data: feedback,
  });
};
