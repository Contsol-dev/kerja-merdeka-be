import { Request, Response } from "express";
import { MockInterviewService } from "../services/mock-interview.service";
import { AuthRequest } from "../interfaces/interface";

const service = new MockInterviewService();

export const startInterview = async (req: AuthRequest, res: Response) => {
  try {
    const { jobDataId } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    const result = await service.startInterview(userId, jobDataId);
    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const answerInterview = async (req: AuthRequest, res: Response) => {
  try {
    const { jobDataId } = req.params;
    const { answer } = req.body;

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    await service.userJobCheck(userId, jobDataId);
    const result = await service.answerQuestion(userId, jobDataId);
    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getInterviewLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { jobDataId } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    await service.userJobCheck(userId, jobDataId);
    const logs = await service.getInterviewLogs(jobDataId);
    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getInterviewFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const { jobDataId } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    await service.userJobCheck(userId, jobDataId);
    const feedback = await service.getInterviewFeedback(jobDataId);
    return res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
