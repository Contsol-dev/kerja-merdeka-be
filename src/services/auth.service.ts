import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../configs/env.config";

export class AuthService {
  async login(email: string, password: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) throw new Error("Invalid credentials");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid credentials");

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
      throw new Error(error);
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
      if (password !== confPassword) throw new Error("Passwords do not match");

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
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
        },
      };
    } catch (error: any) {
      throw new Error(error);
    }
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, env.JWT.SECRET) as { userId: string };
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
