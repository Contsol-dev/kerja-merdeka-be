import { Router } from "express";
import {
  answerInterview,
  getInterviewLogs,
  startInterview,
} from "../controllers/mock-interview.controller";

const router = Router();

router.post("/start", startInterview);
router.post("/answer", answerInterview);
router.get("/logs/:jobDataId", getInterviewLogs);

export default router;
