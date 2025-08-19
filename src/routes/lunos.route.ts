import { Router } from "express";
import { discoverModels, generateText } from "../services/lunos.service";

const router = Router();

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

export default router;
