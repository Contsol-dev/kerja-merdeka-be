import { Router } from "express";
import { JobController } from "../controllers/job.controller";

const router = Router();

router.get("/", JobController.getJobList);
router.post("/", JobController.insertJobData);
router.get("/:jobDataId", JobController.getJobData);
router.put("/:jobDataId", JobController.updateJobData);
router.delete("/:jobDataId", JobController.deleteJobData);

export default router;
