import { ExperienceStatus, ExperienceType, SkillLevel } from "@prisma/client";
import { Request } from "express";

export interface UserCoreData {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  linkedin: string | null;
  portfolio: string | null;
  createdAt: Date;
  updatedAt: Date;
  educations: {
    id: string;
    userId: string;
    degree: string;
    fieldOfStudy: string;
    institution: string;
    startDate: Date;
    endDate: Date | null;
  }[];
  experiences: {
    id: string;
    type: ExperienceType;
    userId: string;
    company: string;
    description: string | null;
    startDate: Date;
    endDate: Date | null;
    status: ExperienceStatus;
    title: string;
  }[];
  skills: {
    id: string;
    name: string;
    userId: string;
    level: SkillLevel;
  }[];
}

export interface UserData extends UserCoreData {
  jobs: {
    id: string;
    createdAt: Date;
    link: string;
    userId: string;
    jobTitle: string;
    company: string;
    description: string | null;
    location: string | null;
    deadline: Date | null;
  }[];
}

export interface UserGeneratedData extends UserData {
  jobs: {
    id: string;
    createdAt: Date;
    link: string;
    userId: string;
    jobTitle: string;
    company: string;
    description: string | null;
    location: string | null;
    deadline: Date | null;
    results: {
      jobDataId: string;
      id: string;
      createdAt: Date;
      cvText: string;
      coverLetter: string;
      summary: string | null;
    } | null;
  }[];
}

export interface SendMailPayload {
  to: string;
  subject: string;
  htmlBody?: string;
  plainBody?: string;
  cc?: string | string[];
  attachments?: string[];
}

export interface AuthRequest extends Request {
  user?: { userId: string };
}
