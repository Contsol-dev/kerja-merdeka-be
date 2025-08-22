import e, { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UnauthorizedError } from "../errors/auth.error";

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, confPassword, name, phone } = req.body;
      const user = await authService.register(
        email,
        password,
        confPassword,
        name,
        phone
      );
      res.status(201).json({ success: true, user });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: "Internal server error" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { token, user } = await authService.login(email, password);
      res.status(200).json({ success: true, token, user });
    } catch (err: any) {
      res
        .status(err instanceof UnauthorizedError ? 401 : 400)
        .json({ success: false, message: err.message });
    }
  }
}
