import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../configs/env.config";
import { ApiError } from "../middlewares/error-handler.middleware";
import logger from "../lib/logger";

export class AuthService {
  async login(email: string, password: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) throw new ApiError(401, "Kredensial tidak valid");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new ApiError(401, "Kredensial tidak valid");

      const expiresInMs =
        typeof env.JWT.EXPIRES_IN === "string"
          ? require("ms")(env.JWT.EXPIRES_IN)
          : env.JWT.EXPIRES_IN;

      const token = jwt.sign({ userId: user.id }, env.JWT.SECRET, {
        expiresIn: expiresInMs,
      });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error: any) {
      logger.error(`Login error: ${error.message}`);
      throw error;
    }
  }

  async register(
    email: string,
    password: string,
    confPassword: string,
    name: string,
    phone: string
  ) {
    try {
      if (password !== confPassword)
        throw new ApiError(400, "Kata sandi tidak cocok");

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone,
        },
      });

      return {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
      };
    } catch (error: any) {
      logger.error(`Registration error: ${error.message}`);
      throw error;
    }
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, env.JWT.SECRET) as { userId: string };
    } catch (error: any) {
      logger.error(`Token verification error: ${error.message}`);
      throw new ApiError(401, "Kredensial tidak valid");
    }
  }
}
