import { Router } from "express";

import testLunosRouter from "./lunos.route";
import testMailRouter from "./mail.route";
import generateDocRouter from "./generate-doc.route";
import mockInterviewRouter from "./mock-interview.route";
import sendJobpackRouter from "./send-jobpack.route";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import jobRouter from "./job.route";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", (req, res) => {
  console.log("Received request for root endpoint");
  res.send("Welcome to the Job Application API");
});
router.use("/lunos", testLunosRouter);
router.use("/lunos", authMiddleware, testLunosRouter);
router.use("/mail", authMiddleware, testMailRouter);
router.use("/doc", authMiddleware, generateDocRouter);
router.use("/interview", authMiddleware, mockInterviewRouter);
router.use("/jobpack", authMiddleware, sendJobpackRouter);
router.use("/job", authMiddleware, jobRouter);
router.use("/user", authMiddleware, userRouter);
router.use("/auth", authRouter);

export default router;
