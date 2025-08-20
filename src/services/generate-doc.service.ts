import { PrismaClient } from "@prisma/client";

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

    const job = user.jobs[0];

    // TODO: Implement AI Integration (Lunos)
    const cvText = `CV for ${user.name}\nSkills: ${user.skills
      .map((s) => s.name)
      .join(", ")}`;
    const coverLetter = `Dear Hiring Manager,\nI am excited to apply for ${job.jobTitle}.\nRegards, ${user.name}`;
    const summary = `Profile: ${user.name} with ${user.experiences.length} experiences.`;

    const result = await prisma.generatedResult.create({
      data: {
        cvText,
        coverLetter,
        summary,
        jobDataId: job.id,
      },
    });

    return result;
  }
}
