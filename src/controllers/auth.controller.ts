import e, { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response) {
    const { email, password, confPassword, name, phone } = req.body;
    const user = await authService.register(
      email,
      password,
      confPassword,
      name,
      phone
    );
    res.status(201).json({ success: true, user });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);
    res.status(200).json({ success: true, token, user });
  }
}
