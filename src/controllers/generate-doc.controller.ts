import { Request, Response } from "express";
import { GenerateDocService } from "../services/generate-doc.service";

const service = new GenerateDocService();

export const generateDoc = async (req: Request, res: Response) => {
  try {
    const { userId, jobDataId } = req.body;
    const result = await service.generate(userId, jobDataId);
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
