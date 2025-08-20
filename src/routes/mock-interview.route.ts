import { Router } from "express";
import { startInterview } from "../controllers/mock-interview.controller";

const router = Router();

router.post("/start", startInterview);

export default router;
