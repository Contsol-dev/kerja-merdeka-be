import { Response } from "express";
import { SendJobpackService } from "../services/send-jobpack.service";
import { AuthRequest } from "../interfaces/interface";
import { UserService } from "../services/user.service";

const sendJobpackService = new SendJobpackService();
const userService = new UserService();

export class SendJobpackController {
  static async sendJobpack(req: AuthRequest, res: Response) {
    const { jobDataId } = req.params;
    const userId = userService.checkCurrentUser(req);

    const response = await sendJobpackService.sendJobpack(userId, jobDataId);
    res.status(200).json({
      success: true,
      data: response,
    });
  }
}
