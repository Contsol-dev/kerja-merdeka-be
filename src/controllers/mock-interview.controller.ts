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
