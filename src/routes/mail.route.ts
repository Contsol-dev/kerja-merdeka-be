import { Router } from "express";
import { handleAttachment, sendMail } from "../services/mailry.service";

const router = Router();

router.get("/test-mail", async (req, res) => {
  try {
    const result = await sendMail({
      to: "gozy.iqbal@gmail.com",
      subject: "Test Email Kerja Merdeka",
      htmlBody: "<h1>Hello Merdeka!</h1><p>Email dummy berhasil 🚀</p>",
      plainBody: "Hello Merdeka! Email dummy berhasil 🚀",
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Mailry API failed", details: error });
  }
});
router.post("/attachment", async (req, res) => {
  try {
    const { filename, buffer } = req.body;

    const attachmentId = await handleAttachment(filename, buffer);

    res.json({ attachmentId });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to upload attachment", details: error });
  }
});

export default router;
