import { Router } from "express";
import { SendJobpackController } from "../controllers/send-jobpack.controller";

const router = Router();

router.get("/:jobDataId", SendJobpackController.sendJobpack);

export default router;
