import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

router.get("/", UserController.getUserData);
router.post("/personal", UserController.insertCvPersonal);
router.post("/experience", UserController.insertCvExperience);
router.post("/education", UserController.insertCvEducation);
router.post("/skills", UserController.insertCvSkill);

export default router;
