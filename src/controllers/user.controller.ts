import { Response } from "express";
import { AuthRequest } from "../interfaces/interface";
import { UserService } from "../services/user.service";
import {
  InsertCvEducationReq,
  InsertCvExperienceReq,
  InsertCvPersonalReq,
  InsertCvSkillReq,
} from "../interfaces/dto.interface";
import logger from "../lib/logger";

const userService = new UserService();

export class UserController {
  static async getUserData(req: AuthRequest, res: Response) {
    const userId = userService.checkCurrentUser(req);

    logger.info(
      `(GET USER DATA) - User ID: ${userId} Attempting to retrieve user data`
    );

    const userData = await userService.getUserData(userId);

    logger.info(
      `(GET USER DATA) - User ID: ${userId} Successfully retrieved user data`
    );

    return res.status(200).json({
      success: true,
      data: userData,
    });
  }

  static async insertCvPersonal(req: AuthRequest, res: Response) {
    const userId = userService.checkCurrentUser(req);

    logger.info(
      `(INSERT CV PERSONAL) - User ID: ${userId} Attempting to insert personal information`
    );

    const data: InsertCvPersonalReq = req.body;
    const updatedUser = await userService.insertCvPersonal(userId, data);

    logger.info(
      `(INSERT CV PERSONAL) - User ID: ${userId} Successfully inserted personal information`
    );

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  }

  static async insertCvExperience(req: AuthRequest, res: Response) {
    const userId = userService.checkCurrentUser(req);

    logger.info(
      `(INSERT CV EXPERIENCE) - User ID: ${userId} Attempting to insert experience information`
    );

    const data: InsertCvExperienceReq[] = req.body;
    const experiences = await userService.insertCvExperience(userId, data);

    logger.info(
      `(INSERT CV EXPERIENCE) - User ID: ${userId} Successfully inserted experience information`
    );

    return res.status(201).json({
      success: true,
      data: experiences,
    });
  }

  static async insertCvEducation(req: AuthRequest, res: Response) {
    const userId = userService.checkCurrentUser(req);

    logger.info(
      `(INSERT CV EDUCATION) - User ID: ${userId} Attempting to insert education information`
    );

    const data: InsertCvEducationReq[] = req.body;
    const educations = await userService.insertCvEducation(userId, data);

    logger.info(
      `(INSERT CV EDUCATION) - User ID: ${userId} Successfully inserted education information`
    );

    return res.status(201).json({
      success: true,
      data: educations,
    });
  }

  static async insertCvSkill(req: AuthRequest, res: Response) {
    const userId = userService.checkCurrentUser(req);

    logger.info(
      `(INSERT CV SKILL) - User ID: ${userId} Attempting to insert skill information`
    );

    const data: InsertCvSkillReq[] = req.body;
    const skills = await userService.insertCvSkill(userId, data);

    logger.info(
      `(INSERT CV SKILL) - User ID: ${userId} Successfully inserted skill information`
    );

    return res.status(201).json({
      success: true,
      data: skills,
    });
  }
}
