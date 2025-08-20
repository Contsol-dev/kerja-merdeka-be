import { Request, Response } from "express";
import { MockInterviewService } from "../services/mock-interview.service";

const service = new MockInterviewService();

export const startInterview = async (req: Request, res: Response) => {
  try {
    const { userId, jobDataId } = req.body;
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

export const answerInterview = async (req: Request, res: Response) => {
  try {
    const { jobDataId, answer } = req.body;
    const result = await service.answerQuestion(jobDataId, answer);
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

export const getInterviewLogs = async (req: Request, res: Response) => {
  try {
    const { jobDataId } = req.params;
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
