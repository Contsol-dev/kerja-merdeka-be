import { PrismaClient } from "@prisma/client";
import { generateDocs } from "./lunos.service";

const prisma = new PrismaClient();

export class GenerateDocService {
  async generate(userId: string, jobDataId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        educations: true,
        experiences: true,
        skills: true,
        jobs: {
          where: { id: jobDataId },
        },
      },
    });

    if (!user) throw new Error("User not found");
    if (!user.jobs.length) throw new Error("Job data not found");

    const { cvText, coverLetter, summary } = await generateDocs(user);

    const result = await prisma.generatedResult.create({
      data: {
        cvText,
        coverLetter,
        summary,
        jobDataId: user.jobs[0].id,
      },
    });

    return result;
  }
}
