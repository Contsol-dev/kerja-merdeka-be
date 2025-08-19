import { Router } from "express";
import { sendMail } from "../services/mailry.service";

const router = Router();

router.get("/test-mail", async (req, res) => {
  try {
    const result = await sendMail({
      emailId: process.env.MAILRY_EMAIL_ID || "",
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

export default router;
