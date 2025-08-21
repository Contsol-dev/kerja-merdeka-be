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

    return user;
  }
}
