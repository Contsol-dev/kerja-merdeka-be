/*
  Warnings:

  - You are about to drop the column `cvText` on the `GeneratedResult` table. All the data in the column will be lost.
  - Added the required column `relevantExperience` to the `GeneratedResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relevantSkills` to the `GeneratedResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."GeneratedResult" DROP COLUMN "cvText",
ADD COLUMN     "relevantExperience" TEXT NOT NULL,
ADD COLUMN     "relevantSkills" TEXT NOT NULL;
