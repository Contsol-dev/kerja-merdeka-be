import { Router } from "express";
import { generateDoc } from "../controllers/generate-doc.controller";

const router = Router();

router.post("/generate", generateDoc);

export default router;
