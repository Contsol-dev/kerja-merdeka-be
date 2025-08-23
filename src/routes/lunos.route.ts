import { Router } from "express";
import { discoverModels, generateText } from "../services/lunos.service";
import { AuthRequest } from "../interfaces/interface";
import { UserService } from "../services/user.service";
import logger from "../lib/logger";
import { GenerateDocService } from "../services/generate-doc.service";

const router = Router();
const userService = new UserService();
const generateService = new GenerateDocService();

router.get("/discover-models", async (req, res) => {
  try {
    const result = await discoverModels();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Lunos API failed", details: error });
  }
});
router.get("/test-lunos", async (req, res) => {
  try {
    const result = await generateText(
      "Buatkan cover letter singkat untuk fresh graduate software engineer."
    );
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "Lunos API failed", details: error });
  }
});
router.get(
  "/test-generate-docs/:userId/:jobDataId",
  async (req: AuthRequest, res) => {
    const { userId, jobDataId } = req.params;
    const { update } = req.query;
    const isUpdate = update === "true";

    logger.info(
      `(GET RESULT) - User ID: ${userId}, Job Data ID: ${jobDataId} Attempting to test doc generate`
    );

    const userData = await userService.getUserJobData(userId, jobDataId);

    logger.info(
      `(GET RESULT) - User ID: ${userId}, Job Data ID: ${jobDataId} Fetched user data`
    );

    const existingResult = await generateService.generate(userData, isUpdate);

    res.json(existingResult);
  }
);

export default router;
