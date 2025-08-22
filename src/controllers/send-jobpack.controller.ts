import { Response } from "express";
import { SendJobpackService } from "../services/send-jobpack.service";
import { AuthRequest } from "../interfaces/interface";
import { UserService } from "../services/user.service";
import logger from "../lib/logger";

const sendJobpackService = new SendJobpackService();
const userService = new UserService();

export class SendJobpackController {
  static async sendJobpack(req: AuthRequest, res: Response) {
    const { jobDataId } = req.params;
    const userId = userService.checkCurrentUser(req);

    logger.info(
      `(SEND JOBPACK) - User ID: ${userId}, Job Data ID: ${jobDataId} Attempting to send jobpack`
    );

    const response = await sendJobpackService.sendJobpack(userId, jobDataId);

    logger.info(
      `(SEND JOBPACK) - User ID: ${userId}, Job Data ID: ${jobDataId} Successfully sent jobpack`
    );

    res.status(200).json({
      success: true,
      data: response,
    });
  }
}
