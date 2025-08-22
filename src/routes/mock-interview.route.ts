import { Router } from "express";
import {
  answerInterview,
  getInterviewFeedback,
  getInterviewLogs,
  startInterview,
} from "../controllers/mock-interview.controller";

const router = Router();

router.post("/start/:jobDataId", startInterview); // Start a new mock interview
router.post("/answer/:jobDataId", answerInterview); // Answer interview question
router.get("/logs/:jobDataId", getInterviewLogs); // Get interview logs
router.get("/feedback/:jobDataId", getInterviewFeedback); // Get interview feedback

export default router;
