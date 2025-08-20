/*
  Warnings:

  - Changed the type of `group` on the `Skill` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."SkillGroup" AS ENUM ('PROGRAMMING', 'LANGUAGE', 'MANAGEMENT', 'OTHER');

-- DropForeignKey
ALTER TABLE "public"."Education" DROP CONSTRAINT "Education_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Experience" DROP CONSTRAINT "Experience_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."JobData" DROP CONSTRAINT "JobData_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Log" DROP CONSTRAINT "Log_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Skill" DROP CONSTRAINT "Skill_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Skill" DROP COLUMN "group",
ADD COLUMN     "group" "public"."SkillGroup" NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Education" ADD CONSTRAINT "Education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Experience" ADD CONSTRAINT "Experience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Skill" ADD CONSTRAINT "Skill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobData" ADD CONSTRAINT "JobData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
