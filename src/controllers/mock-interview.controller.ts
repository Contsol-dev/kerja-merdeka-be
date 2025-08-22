import { Response } from "express";
import { MockInterviewService } from "../services/mock-interview.service";
import { AuthRequest } from "../interfaces/interface";
import { UserService } from "../services/user.service";

const service = new MockInterviewService();
const userService = new UserService();

export const startInterview = async (req: AuthRequest, res: Response) => {
  const { jobDataId } = req.params;
  const userId = userService.checkCurrentUser(req);

  const result = await service.startInterview(userId, jobDataId);
  return res.status(201).json({
    success: true,
    data: result,
  });
};

export const answerInterview = async (req: AuthRequest, res: Response) => {
  const { jobDataId } = req.params;
  const { answer } = req.body;

  const userId = userService.checkCurrentUser(req);

  await service.userJobCheck(userId, jobDataId);
  const result = await service.answerQuestion(jobDataId, answer);
  return res.status(201).json({
    success: true,
    data: result,
  });
};

export const getInterviewLogs = async (req: AuthRequest, res: Response) => {
  const { jobDataId } = req.params;
  const userId = userService.checkCurrentUser(req);

  await service.userJobCheck(userId, jobDataId);
  const logs = await service.getInterviewLogs(jobDataId);
  return res.status(200).json({
    success: true,
    data: logs,
  });
};

export const getInterviewFeedback = async (req: AuthRequest, res: Response) => {
  const { jobDataId } = req.params;
  const userId = userService.checkCurrentUser(req);

  await service.userJobCheck(userId, jobDataId);
  const feedback = await service.getInterviewFeedback(jobDataId);
  return res.status(200).json({
    success: true,
    data: feedback,
  });
};
