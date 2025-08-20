import { ChatCompletionMessageParam } from "openai/resources/index";
import { UserService } from "./user.service";
import { UserData } from "../interfaces/interface";
import { chatCompletion } from "./unli.service";

export class MockInterviewService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  formatUserKnowledge(userData: UserData): string {
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
    Focus on relevant skills and experiences.
    `;

      const userKnowledge = this.formatUserKnowledge(user);

      const messages: ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userKnowledge,
        },
        {
          role: "user",
          content: "Please start the interview with the first question.",
        },
      ];

      const question = await chatCompletion(messages);

      return { question: question };
    } catch (error: any) {
      throw new Error("Failed to start interview: " + error.message);
    }
  }
}
