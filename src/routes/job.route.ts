import { Router } from "express";
import { JobController } from "../controllers/job.controller";

const router = Router();

router.get("/", JobController.getJobList);
router.post("/", JobController.insertJobData);

export default router;
