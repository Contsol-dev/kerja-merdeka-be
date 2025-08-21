import { Router } from "express";
import { GenerateDocController } from "../controllers/generate-doc.controller";

const router = Router();

router.get("/:userId/:jobDataId", GenerateDocController.getResult);

export default router;
