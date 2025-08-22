import { Router } from "express";

import testLunosRouter from "./lunos.route";
import testMailRouter from "./mail.route";
import generateDocRouter from "./generate-doc.route";
import mockInterviewRouter from "./mock-interview.route";
import sendJobpackRouter from "./send-jobpack.route";

const router = Router();

router.get("/", (req, res) => {
  console.log("Received request for root endpoint");
  res.send("Welcome to the Job Application API");
});
router.use("/lunos", testLunosRouter);
router.use("/mail", testMailRouter);
router.use("/doc", generateDocRouter);
router.use("/interview", mockInterviewRouter);
router.use("/jobpack", sendJobpackRouter);

export default router;
