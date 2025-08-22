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
      throw new ApiError(400, "User ID and Job Data ID are required");

    const job = await prisma.jobData.findUnique({
      where: { id: jobDataId, userId },
    });

    if (!job) throw new ApiError(404, "Job data not found for the user");

    return;
  }

  formatuserJobContext(userData: UserData): string {
    const experiences = userData.experiences
      .map(
        (exp) =>
          `- ${exp.title} at ${exp.company} (${exp.startDate.getFullYear()} - ${
            exp.endDate?.getFullYear() || "Present"
          })`
      )
      .join("\n");

    const educations = userData.educations
      .map(
        (edu) =>
          `- ${edu.degree} in ${edu.fieldOfStudy} from ${
            edu.institution
          } (${edu.startDate.getFullYear()} - ${
            edu.endDate?.getFullYear() || "Present"
          })`
      )
      .join("\n");

    const skills = userData.skills.map((skill) => skill.name).join(", ");

    return `
    Candidate Profile:
    Name: ${userData.name}

    Applied Job:
    Title: ${userData.jobs[0].jobTitle}
    Description: ${userData.jobs[0].description}

    Education:
    ${educations}

    Experiences:
    ${experiences}

    Skills:
    ${skills}
    `.trim();
  }

  async startInterview(userId: string, jobDataId: string) {
    try {
      const user = await this.userService.getUserJobData(userId, jobDataId);

      if (!user.jobs.length) throw new ApiError(404, "Job data not found");

      const systemPrompt = `
    You are an interviewer for the role of ${user.jobs[0].jobTitle}.
    Your goal is to assess the candidate's knowledge and skills based on their profile.
    Ask one question at a time.
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
          content: "Please start the interview with the first question.",
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

      if (!interviewInfo) throw new ApiError(404, "User job context not found");

      const lastLog = await prisma.interviewLog.findFirst({
        where: { jobDataId: jobDataId, answer: null },
        orderBy: { createdAt: "desc" },
      });

      if (!lastLog) throw new ApiError(404, "No unanswered questions found");

      await prisma.interviewLog.update({
        where: { id: lastLog.id },
        data: { answer },
      });

      const messages: ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: "You are an interviewer conducting a job interview.",
        },
        { role: "user", content: interviewInfo.context },
        { role: "assistant", content: lastLog.question },
        { role: "user", content: answer },
        {
          role: "user",
          content: "Please continue the interview with the next question.",
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

      if (!logs.length) throw new ApiError(404, "No interview logs found");

      const qaPairs = logs
        .map((log) => `Q: ${log.question}\nA: ${log.answer || "No answer yet"}`)
        .join("\n\n");

      const messages: ChatMessage[] = [
        {
          role: "system",
          content: `
        You are an experienced HR interviewer. 
        You will evaluate the candidate's interview answers. 
        Provide:
        1. A detailed feedback (strengths, weaknesses, suggestions).
        2. A score (0-100) based on the overall performance.
        Output in JSON format: { "feedback": "...", "score": number }
        `.trim(),
        },
        {
          role: "user",
          content: `Here are the interview Q&A logs:\n\n${qaPairs}`,
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
