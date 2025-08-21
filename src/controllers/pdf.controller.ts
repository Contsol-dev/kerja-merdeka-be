import { Request, Response } from "express";
import { PdfService } from "../services/pdf.service";
import { UserService } from "../services/user.service";

const pdfService = new PdfService();
const userService = new UserService();

export class PdfController {
  static async getCV(req: Request, res: Response) {
    try {
      const { userId, jobDataId } = req.params;
      const userData = await userService.getUserGeneratedData(
        userId,
        jobDataId
      );
      pdfService.generateCV(userData, res);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getCoverLetter(req: Request, res: Response) {
    try {
      const { userId, jobDataId } = req.params;
      const userData = await userService.getUserGeneratedData(
        userId,
        jobDataId
      );
      pdfService.generateCoverLetter(userData, res);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
