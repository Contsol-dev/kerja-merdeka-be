import prisma from "../lib/prisma";

export class UserService {
  async getUserJobData(userId: string, jobDataId: string) {
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

    return user;
  }

  async getUserGeneratedData(userId: string, jobDataId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        educations: true,
        experiences: true,
        skills: true,
        jobs: {
          where: { id: jobDataId },
          include: {
            results: true,
          },
        },
      },
    });

    if (!user) throw new Error("User not found");
    if (user.jobs.length === 0)
      throw new Error("Job data not found for the user");
    if (user.jobs[0].results === null)
      throw new Error("User generated data not found");

    return user;
  }
}
