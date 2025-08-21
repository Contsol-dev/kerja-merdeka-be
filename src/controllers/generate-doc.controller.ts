import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { GenerateDocService } from "../services/generate-doc.service";

const generateDocService = new GenerateDocService();
const userService = new UserService();

export class GenerateDocController {
  static async getResult(req: Request, res: Response) {
    try {
      const { userId, jobDataId } = req.params;
      const { result } = req.query;

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

        default:
          break;

        case "summary":
          res.status(200).json({
            success: true,
            data: {
              summary: existingResult?.summary,
            },
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
