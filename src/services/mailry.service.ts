import axios from "axios";
import env from "../configs/env.config";

interface SendMailPayload {
  emailId: string;
  to: string;
  subject: string;
  htmlBody?: string;
  plainBody?: string;
  cc?: string | string[];
  attachments?: string[];
}

export async function sendMail(payload: SendMailPayload) {
  try {
    const resp = await axios.post(
      "https://api.mailry.co/ext/inbox/send",
      {
        emailId: payload.emailId,
        to: payload.to,
        subject: payload.subject,
        htmlBody: payload.htmlBody,
        plainBody: payload.plainBody,
        cc: payload.cc,
        attachments: payload.attachments,
      },
      {
        headers: {
          Authorization: `Bearer ${env.MAILRY.API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return resp.data;
  } catch (error) {
    throw new Error(`Mailry API failed: ${error}`);
  }
}
