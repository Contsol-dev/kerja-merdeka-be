/*
  Warnings:

  - You are about to drop the column `group` on the `Skill` table. All the data in the column will be lost.
  - Added the required column `status` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `JobData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `JobData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Skill` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ExperienceType" AS ENUM ('WORK', 'ORGANIZATION', 'VOLUNTEER', 'EVENT');

-- CreateEnum
CREATE TYPE "public"."ExperienceStatus" AS ENUM ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'HONORARY', 'OUTSOURCED');

-- CreateEnum
CREATE TYPE "public"."SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'EXPERT', 'SPECIALIST');

-- AlterTable
ALTER TABLE "public"."Experience" ADD COLUMN     "status" "public"."ExperienceStatus" NOT NULL,
ADD COLUMN     "type" "public"."ExperienceType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."JobData" ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "link" TEXT NOT NULL,
ADD COLUMN     "location" TEXT,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Skill" DROP COLUMN "group",
ADD COLUMN     "level" "public"."SkillLevel" NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "address" TEXT;

-- DropEnum
DROP TYPE "public"."SkillGroup";
