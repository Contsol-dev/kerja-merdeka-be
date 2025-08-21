import { Router } from "express";

import testLunosRouter from "./lunos.route";
import testMailRouter from "./mail.route";
import generateDocRouter from "./generate-doc.route";
import mockInterviewRouter from "./mock-interview.route";

const router = Router();

router.use("/lunos", testLunosRouter);
router.use("/mail", testMailRouter);
router.use("/doc", generateDocRouter);
router.use("/interview", mockInterviewRouter);

export default router;
