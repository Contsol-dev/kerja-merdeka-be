import { ExperienceStatus, ExperienceType, SkillLevel } from "@prisma/client";

export interface InsertCvPersonalReq {
  name: string;
  email: string;
  phone: string;
  address: string | null;
  linkedin: string | null;
  portfolio: string | null;
}

export interface InsertCvExperienceReq {
  type: ExperienceType;
  status: ExperienceStatus;
  title: string;
  company: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
}

export interface InsertCvEducationReq {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date | null;
}

export interface InsertCvSkillReq {
  name: string;
  level: SkillLevel;
}

export interface InsertJobDataReq {
  link: string;
  company: string;
  jobTitle: string;
  location: string | null;
  deadline: Date | null;
  description: string | null;
}
