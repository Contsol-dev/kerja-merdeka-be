import axios from "axios";
import env from "../configs/env.config";
import FormData from "form-data";
import { SendMailPayload } from "../interfaces/interface";
import logger from "../lib/logger";
import { ApiError } from "../middlewares/error-handler.middleware";

export async function handleAttachment(
  filename: string,
  buffer: Buffer | Uint8Array | ArrayBuffer
) {
  try {
    const safeBuffer = Buffer.isBuffer(buffer)
      ? buffer
      : Buffer.from(buffer as any);

    const form = new FormData();
    form.append("file", safeBuffer, { filename });

    const resp = await axios.post(
      `${env.MAILRY.API_URL}/inbox/upload-attachment`,
      form,
      {
        headers: {
          Authorization: `Bearer ${env.MAILRY.API_KEY}`,
          ...form.getHeaders(),
        },
      }
    );

    return resp.data.data.id;
  } catch (error) {
    logger.error(`Attachment upload failed: ${error}`);
    throw error;
  }
}

export async function sendMail(
  payload: Omit<SendMailPayload, "attachments"> & { attachments?: string[] }
) {
  try {
    const resp = await axios.post(
      `${env.MAILRY.API_URL}/inbox/send`,
      {
        emailId: env.MAILRY.EMAIL_ID,
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
    logger.error(`Mailry API failed: ${error}`);
    throw error;
  }
}
