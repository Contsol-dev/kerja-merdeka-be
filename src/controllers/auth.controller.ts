import e, { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import logger from "../lib/logger";
import { AuthRequest } from "../interfaces/interface";

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response) {
    const { email, password, confPassword, name, phone } = req.body;

    logger.info(`(REGISTER) - User email: ${email} Attempting registration`);

    const user = await authService.register(
      email,
      password,
      confPassword,
      name,
      phone
    );

    logger.info(`(REGISTER) - User email: ${email} Registration successful`);

    res.status(201).json({ success: true, user });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    logger.info(`(LOGIN) - User email: ${email} Attempting login`);

    const { token, user } = await authService.login(email, password);

    logger.info(`(LOGIN) - User email: ${email} Login successful`);

    res.status(200).json({ success: true, token, user });
  }

  static async getMe(req: AuthRequest, res: Response) {
    return res.status(200).json({ success: true, user: req.user });
  }
}
