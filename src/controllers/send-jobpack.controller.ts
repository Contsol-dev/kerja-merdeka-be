import { Request, Response } from "express";
import { SendJobpackService } from "../services/send-jobpack.service";

const sendJobpackService = new SendJobpackService();

export class SendJobpackController {
  static async sendJobpack(req: Request, res: Response) {
    try {
      console.log("Received request to send jobpack...");

      const { userId, jobDataId } = req.params;
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
