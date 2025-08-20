import { Router } from "express";
import { generateDoc } from "../controllers/generate-doc.controller";

const router = Router();

router.post("/generate-doc", generateDoc);

export default router;
