import { Request, Response } from "express";
import { SendJobpackService } from "../services/send-jobpack.service";
import { AuthRequest } from "../interfaces/interface";

const sendJobpackService = new SendJobpackService();

export class SendJobpackController {
  static async sendJobpack(req: AuthRequest, res: Response) {
    try {
      console.log("Received request to send jobpack...");

      const { jobDataId } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User ID not found",
        });
      }

      const response = await sendJobpackService.sendJobpack(userId, jobDataId);
      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
