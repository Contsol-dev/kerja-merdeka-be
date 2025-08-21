import { Router } from "express";
import { PdfController } from "../controllers/pdf.controller";

const router = Router();

router.get("/cv/:userId/:jobDataId", PdfController.getCV);
router.get("/cover-letter/:userId/:jobDataId", PdfController.getCoverLetter);

export default router;
