/*
  Warnings:

  - You are about to drop the column `github` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "github",
ADD COLUMN     "portfolio" TEXT;
