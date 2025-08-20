import { Router } from "express";
import {
  answerInterview,
  startInterview,
} from "../controllers/mock-interview.controller";

const router = Router();

router.post("/start", startInterview);
router.post("/answer", answerInterview);

export default router;
