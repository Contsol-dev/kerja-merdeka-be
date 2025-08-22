import axios from "axios";
import env from "../configs/env.config";
import FormData from "form-data";
import { SendMailPayload } from "../interfaces/interface";

export async function handleAttachment(
  filename: string,
  buffer: Buffer | Uint8Array | ArrayBuffer
) {
  try {
    console.log(`Uploading attachment: ${filename}`);

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

    console.log(`Attachment uploaded:\n`, resp);

    return resp.data.data.id;
  } catch (error) {
    throw new Error(`Failed to upload attachment: ${error}`);
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
    throw new Error(`Mailry API failed: ${error}`);
  }
}
