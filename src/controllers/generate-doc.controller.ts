import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { GenerateDocService } from "../services/generate-doc.service";
import { AuthRequest } from "../interfaces/interface";

const generateDocService = new GenerateDocService();
const userService = new UserService();

export class GenerateDocController {
  static async getResult(req: AuthRequest, res: Response) {
    try {
      const { jobDataId } = req.params;
      const { result } = req.query;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User ID not found",
        });
      }

      const userData = await userService.getUserJobData(userId, jobDataId);

      const existingResult = await generateDocService.generate(userData);

      switch (result) {
        case "cv":
          generateDocService.generateCv(userData, existingResult?.summary, res);
          break;

        case "cover-letter":
          generateDocService.generateCoverLetter(
            userData,
            existingResult?.coverLetter,
            res
          );
          break;

        case "summary":
          res.status(200).json({
            success: true,
            data: {
              summary: existingResult?.summary,
            },
          });
          break;

        default:
          res.status(400).json({
            success: false,
            message: "Invalid result type",
          });
          break;
      }
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
