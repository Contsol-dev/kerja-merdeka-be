import path from "path";
import ejs from "ejs";
import { GenerateDocService } from "./generate-doc.service";
import { handleAttachment, sendMail } from "./mailry.service";
import { UserService } from "./user.service";
import { toPlainText } from "../utils/utils";
import { ApiError } from "../middlewares/error-handler.middleware";
import logger from "../lib/logger";

const userService = new UserService();
const generateDocService = new GenerateDocService();

export class SendJobpackService {
  async sendJobpack(userId: string, jobDataId: string) {
    try {
      const userData = await userService.getUserGeneratedData(
        userId,
        jobDataId
      );

      const result = userData.jobs[0].results;

      if (!result) throw new ApiError(404, "Tidak ada hasil ditemukan");

      const cvBuffer = await generateDocService.renderCvBuffer(
        userData,
        result.summary,
        result.relevantExperience,
        result.relevantSkills
      );
      const coverLetterBuffer =
        await generateDocService.renderCoverLetterBuffer(
          userData,
          result.coverLetter
        );

      const cvAttachmentId = await handleAttachment(
        `cv-${userData.id}-${jobDataId}.pdf`,
        cvBuffer
      );
      const coverLetterAttachmentId = await handleAttachment(
        `cover-letter-${userData.id}-${jobDataId}.pdf`,
        coverLetterBuffer
      );

      const htmlBody = await ejs.renderFile(
        path.join(process.cwd(), "src", "views", "email", "jobpack.ejs"),
        {
          user: userData,
          jobTitle: userData.jobs[0].jobTitle,
          summary: result.summary,
          topSkills: userData.skills?.slice(0, 6).map((s) => s.name) ?? [],
          experiences: userData.experiences ?? [],
          ctaUrl: userData.jobs[0].link ?? null,
          sentAt: new Date().toLocaleString("id-ID", {
            dateStyle: "long",
            timeStyle: "short",
          }),
        }
      );
      const plainBody = toPlainText(htmlBody);

      const resp = await sendMail({
        to: userData.email,
        subject: `Lamaran Pekerjaan - ${userData.jobs[0].jobTitle} - ${userData.name}`,
        htmlBody,
        plainBody,
        attachments: [cvAttachmentId, coverLetterAttachmentId],
      });

      return resp;
    } catch (error: any) {
      logger.error("Failed to send jobpack: " + error.message);
      throw error;
    }
  }
}
