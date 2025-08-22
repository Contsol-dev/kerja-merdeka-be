/*
  Warnings:

  - You are about to drop the `Log` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Log" DROP CONSTRAINT "Log_userId_fkey";

-- DropTable
DROP TABLE "public"."Log";
