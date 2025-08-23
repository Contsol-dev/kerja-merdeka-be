import { Response } from "express";
import { UserService } from "../services/user.service";
import { GenerateDocService } from "../services/generate-doc.service";
import { AuthRequest } from "../interfaces/interface";
import logger from "../lib/logger";

const generateDocService = new GenerateDocService();
const userService = new UserService();

export class GenerateDocController {
  static async getResult(req: AuthRequest, res: Response) {
    const { jobDataId } = req.params;
    const { result, update } = req.query;

    const userId = userService.checkCurrentUser(req);
    const isUpdate = update === "true";

    logger.info(
      `(GET RESULT) - User ID: ${userId}, Job Data ID: ${jobDataId} Attempting to get ${result}`
    );

    const userData = await userService.getUserJobData(userId, jobDataId);

    logger.info(
      `(GET RESULT) - User ID: ${userId}, Job Data ID: ${jobDataId} Fetched user data`
    );

    const existingResult = await generateDocService.generate(
      userData,
      isUpdate
    );

    logger.info(
      `(GET RESULT) - User ID: ${userId}, Job Data ID: ${jobDataId} Generated document`
    );

    switch (result) {
      case "cv":
        generateDocService.generateCv(
          userData,
          existingResult?.summary,
          res,
          isUpdate
        );
        break;

      case "cover-letter":
        generateDocService.generateCoverLetter(
          userData,
          existingResult?.coverLetter,
          res,
          isUpdate
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
  }
}
