import { ChatCompletionMessageParam } from "openai/resources/index";
import { UserService } from "./user.service";
import { UserData } from "../interfaces/interface";
import { chatCompletion } from "./unli.service";
import prisma from "../lib/prisma";
import { createCompletionJson } from "./lunos.service";
import { ChatMessage } from "@lunos/client";
import { ApiError } from "../middlewares/error-handler.middleware";
import logger from "../lib/logger";

export class MockInterviewService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async userJobCheck(userId: string, jobDataId: string) {
    if (!userId || !jobDataId)
      throw new ApiError(400, "ID Pengguna dan ID Lowongan diperlukan");

    const job = await prisma.jobData.findUnique({
      where: { id: jobDataId, userId },
    });

    if (!job) throw new ApiError(404, "Data Lowongan tidak ditemukan");

    return;
  }

  formatuserJobContext(userData: UserData): string {
    const experiences = userData.experiences
      .map(
        (exp) =>
          `- ${exp.title} at ${exp.company} (${exp.startDate.getFullYear()} - ${
            exp.endDate?.getFullYear() || "Sekarang"
          })`
      )
      .join("\n");

    const educations = userData.educations
      .map(
        (edu) =>
          `- ${edu.degree} in ${edu.fieldOfStudy} from ${
            edu.institution
          } (${edu.startDate.getFullYear()} - ${
            edu.endDate?.getFullYear() || "Sekarang"
          })`
      )
      .join("\n");

    const skills = userData.skills.map((skill) => skill.name).join(", ");

    return `
    Profil Kandidat:
    Nama: ${userData.name}

    Lowongan yang Dilamar:
    Judul: ${userData.jobs[0].jobTitle}
    Deskripsi: ${userData.jobs[0].description}

    Pendidikan:
    ${educations}

    Pengalaman:
    ${experiences}

    Keterampilan:
    ${skills}
    `.trim();
  }

  async startInterview(userId: string, jobDataId: string) {
    try {
      await prisma.interviewLog.deleteMany({ where: { jobDataId } });
      await prisma.interviewInfo.deleteMany({ where: { jobDataId } });

      const user = await this.userService.getUserJobData(userId, jobDataId);

      if (!user.jobs.length)
        throw new ApiError(404, "Data Lowongan tidak ditemukan");

      const systemPrompt = `
        Anda adalah pewawancara untuk posisi ${user.jobs[0].jobTitle}.
        Tujuan Anda adalah untuk menilai pengetahuan dan keterampilan kandidat berdasarkan profil mereka.
        Ajukan satu pertanyaan pada satu waktu.
        `;

      const userJobContext = this.formatuserJobContext(user);
      await prisma.interviewInfo.create({
        data: {
          jobDataId: jobDataId,
          context: userJobContext,
        },
      });

      const messages: ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userJobContext,
        },
        {
          role: "user",
          content: "Silakan mulai wawancara dengan pertanyaan pertama.",
        },
      ];

      const question = await chatCompletion(messages);

      const newLog = await prisma.interviewLog.create({
        data: {
          jobDataId: jobDataId,
          question: question,
        },
      });

      return { question: newLog.question };
    } catch (error: any) {
      logger.error("Failed to start interview: " + error.message);
      throw error;
    }
  }

  async answerQuestion(jobDataId: string, answer: string) {
    try {
      const interviewInfo = await prisma.interviewInfo.findUnique({
        where: { jobDataId: jobDataId },
        select: { context: true },
      });

      if (!interviewInfo)
        throw new ApiError(404, "Konteks wawancara tidak ditemukan");

      const lastLog = await prisma.interviewLog.findFirst({
        where: { jobDataId: jobDataId, answer: null },
        orderBy: { createdAt: "desc" },
      });

      if (!lastLog)
        throw new ApiError(404, "Tidak ada pertanyaan yang belum terjawab");

      await prisma.interviewLog.update({
        where: { id: lastLog.id },
        data: { answer },
      });

      const messages: ChatCompletionMessageParam[] = [
        {
          role: "system",
          content:
            "Anda adalah pewawancara yang sedang melakukan wawancara kerja.",
        },
        { role: "user", content: interviewInfo.context },
        { role: "assistant", content: lastLog.question },
        { role: "user", content: answer },
        {
          role: "user",
          content: "Silakan lanjutkan wawancara dengan pertanyaan berikutnya.",
        },
      ];

      const nextQuestion = await chatCompletion(messages);

      const newLog = await prisma.interviewLog.create({
        data: {
          jobDataId: jobDataId,
          question: nextQuestion,
        },
      });

      return { question: newLog.question };
    } catch (error: any) {
      logger.error("Failed to answer question: " + error.message);
      throw error;
    }
  }

  async getInterviewLogs(jobDataId: string) {
    try {
      const logs = await prisma.interviewLog.findMany({
        where: { jobDataId },
        orderBy: { createdAt: "asc" },
      });

      return logs;
    } catch (error: any) {
      logger.error("Failed to get interview logs: " + error.message);
      throw error;
    }
  }

  async getInterviewFeedback(jobDataId: string) {
    try {
      const interviewInfo = await prisma.interviewInfo.findUnique({
        where: { jobDataId: jobDataId },
      });

      if (interviewInfo?.feedback) {
        return {
          feedback: interviewInfo.feedback,
          score: interviewInfo.score,
        };
      }

      const logs = await this.getInterviewLogs(jobDataId);

      if (!logs.length)
        throw new ApiError(404, "Tidak ada log wawancara ditemukan");

      const qaPairs = logs
        .map(
          (log) => `Q: ${log.question}\nA: ${log.answer || "Belum ada jawaban"}`
        )
        .join("\n\n");

      const messages: ChatMessage[] = [
        {
          role: "system",
          content: `
        Anda adalah pewawancara yang berpengalaman.
        Anda akan mengevaluasi jawaban wawancara kandidat.
        Berikan:
        1. Umpan balik yang mendetail (kekuatan, kelemahan, saran) sebagai string, bukan array.
        2. Skor (0-100) berdasarkan kinerja keseluruhan.
        Output dalam format JSON: { "feedback": "...", "score": number }
        `.trim(),
        },
        {
          role: "user",
          content: `Berikut adalah log tanya jawab wawancara:\n\n${qaPairs}`,
        },
      ];

      const { feedback, score } = await createCompletionJson(messages);

      const updatedInterviewInfo = await prisma.interviewInfo.update({
        where: { jobDataId: jobDataId },
        data: { feedback, score },
      });

      return {
        feedback: updatedInterviewInfo.feedback,
        score: updatedInterviewInfo.score,
      };
    } catch (error: any) {
      logger.error("Failed to get interview feedback: " + error.message);
      throw error;
    }
  }
}
