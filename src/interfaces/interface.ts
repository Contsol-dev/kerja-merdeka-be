import { SkillGroup } from "@prisma/client";

export interface UserData {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  createdAt: Date;
  updatedAt: Date;
  jobs: {
    id: string;
    createdAt: Date;
    jobTitle: string;
    description: string;
    userId: string;
  }[];
  educations: {
    id: string;
    userId: string;
    degree: string;
    fieldOfStudy: string;
    institution: string;
    startDate: Date;
    endDate: Date;
  }[];
  experiences: {
    id: string;
    description: string | null;
    userId: string;
    startDate: Date;
    endDate: Date;
    title: string;
    company: string;
  }[];
  skills: {
    id: string;
    name: string;
    userId: string;
    group: SkillGroup;
  }[];
}
