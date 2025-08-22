import { Response } from "express";
import { AuthRequest } from "../interfaces/interface";
import { UserService } from "../services/user.service";
import {
  InsertCvEducationReq,
  InsertCvExperienceReq,
  InsertCvPersonalReq,
  InsertCvSkillReq,
} from "../interfaces/dto.interface";

const userService = new UserService();

export class UserController {
  static async getUserData(req: AuthRequest, res: Response) {
    try {
      const userId = userService.checkCurrentUser(req);

      const userData = await userService.getUserData(userId);
      return res.status(200).json({
        success: true,
        data: userData,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  static async insertCvPersonal(req: AuthRequest, res: Response) {
    try {
      const userId = userService.checkCurrentUser(req);

      const data: InsertCvPersonalReq = req.body;
      const updatedUser = await userService.insertCvPersonal(userId, data);

      return res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Bad Request",
      });
    }
  }

  static async insertCvExperience(req: AuthRequest, res: Response) {
    try {
      const userId = userService.checkCurrentUser(req);

      const data: InsertCvExperienceReq[] = req.body;
      const experiences = await userService.insertCvExperience(userId, data);

      return res.status(201).json({
        success: true,
        data: experiences,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Bad Request",
      });
    }
  }

  static async insertCvEducation(req: AuthRequest, res: Response) {
    try {
      const userId = userService.checkCurrentUser(req);

      const data: InsertCvEducationReq[] = req.body;
      const educations = await userService.insertCvEducation(userId, data);

      return res.status(201).json({
        success: true,
        data: educations,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Bad Request",
      });
    }
  }

  static async insertCvSkill(req: AuthRequest, res: Response) {
    try {
      const userId = userService.checkCurrentUser(req);

      const data: InsertCvSkillReq[] = req.body;
      const skills = await userService.insertCvSkill(userId, data);

      return res.status(201).json({
        success: true,
        data: skills,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Bad Request",
      });
    }
  }
}
