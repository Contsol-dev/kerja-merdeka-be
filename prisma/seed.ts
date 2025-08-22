import {
  PrismaClient,
  ExperienceType,
  ExperienceStatus,
  SkillLevel,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.interviewLog.deleteMany();
  await prisma.generatedResult.deleteMany();
  await prisma.jobData.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("kerjamerdeka123", 10);

  const user = await prisma.user.create({
    data: {
      email: "iqbal@example.com",
      password: hashedPassword,
      name: "Iqbal Ghozy",
      phone: "+628123456789",
      linkedin: "https://linkedin.com/in/iqbalghozy",
      portfolio: "https://github.com/iqbalghozy",
    },
  });

  await prisma.education.create({
    data: {
      degree: "Bachelor of Computer Science",
      fieldOfStudy: "Software Engineering",
      institution: "Universitas Indonesia",
      startDate: new Date("2018-08-01"),
      endDate: new Date("2022-07-31"),
      userId: user.id,
    },
  });

  await prisma.experience.createMany({
    data: [
      {
        type: ExperienceType.WORK,
        status: ExperienceStatus.FULL_TIME,
        title: "Backend Developer",
        company: "Tech Solutions",
        description: "Developed REST APIs using Node.js and PostgreSQL",
        startDate: new Date("2022-08-01"),
        endDate: new Date("2023-12-31"),
        userId: user.id,
      },
      {
        type: ExperienceType.WORK,
        status: ExperienceStatus.FULL_TIME,
        title: "Fullstack Developer",
        company: "Startup Hub",
        description: "Built web apps with React and Express",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-01-31"),
        userId: user.id,
      },
    ],
  });

  await prisma.skill.createMany({
    data: [
      { name: "Node.js", level: SkillLevel.EXPERT, userId: user.id },
      { name: "React.js", level: SkillLevel.INTERMEDIATE, userId: user.id },
      { name: "PostgreSQL", level: SkillLevel.EXPERT, userId: user.id },
      { name: "Docker", level: SkillLevel.BEGINNER, userId: user.id },
    ],
  });

  const job = await prisma.jobData.create({
    data: {
      link: "https://company.com/jobs/software-engineer",
      jobTitle: "Software Engineer",
      company: "Tech Solutions",
      description:
        "We are looking for a passionate Software Engineer to join our dynamic team...",
      userId: user.id,
      location: "Jakarta",
      deadline: new Date("2025-12-31"),
    },
  });

  console.log("✅ Seed data berhasil dibuat!");
  console.log("User ID:", user.id);
  console.log("Job ID:", job.id);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
