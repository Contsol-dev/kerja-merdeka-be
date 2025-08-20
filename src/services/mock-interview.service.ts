import { ChatCompletionMessageParam } from "openai/resources/index";
import { UserService } from "./user.service";
import { UserData } from "../interfaces/interface";
import { chatCompletion } from "./unli.service";
import prisma from "../lib/prisma";

export class MockInterviewService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  formatuserJobContext(userData: UserData): string {
    const experiences = userData.experiences
      .map(
        (exp) =>
          `- ${exp.title} at ${
            exp.company
          } (${exp.startDate.getFullYear()} - ${exp.endDate.getFullYear()})`
      )
      .join("\n");

    const educations = userData.educations
      .map(
        (edu) =>
          `- ${edu.degree} in ${edu.fieldOfStudy} from ${
            edu.institution
          } (${edu.startDate.getFullYear()} - ${edu.endDate.getFullYear()})`
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

      if (!user.jobs.length) throw new Error("Job data not found");

      const systemPrompt = `
    You are an interviewer for the role of ${user.jobs[0].jobTitle}.
    Your goal is to assess the candidate's knowledge and skills based on their profile.
    Ask one question at a time.
    `;

      const userJobContext = this.formatuserJobContext(user);
      await prisma.userJobContext.create({
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
      throw new Error("Failed to start interview: " + error.message);
    }
  }

  async answerQuestion(jobDataId: string, answer: string) {
    try {
      const userJobContext = await prisma.userJobContext.findUnique({
        where: { jobDataId: jobDataId },
      });

      if (!userJobContext) throw new Error("User job context not found");

      const lastLog = await prisma.interviewLog.findFirst({
        where: { jobDataId: jobDataId, answer: null },
        orderBy: { createdAt: "desc" },
      });

      if (!lastLog) throw new Error("No unanswered questions found");

      await prisma.interviewLog.update({
        where: { id: lastLog.id },
        data: { answer },
      });

      const messages: ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: "You are an interviewer conducting a job interview.",
        },
        { role: "user", content: userJobContext.context },
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
      throw new Error("Failed to answer question: " + error.message);
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
      throw new Error("Failed to get interview logs: " + error.message);
    }
  }
}
