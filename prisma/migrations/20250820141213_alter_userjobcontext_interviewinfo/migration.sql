/*
  Warnings:

  - You are about to drop the `UserJobContext` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."UserJobContext" DROP CONSTRAINT "UserJobContext_jobDataId_fkey";

-- DropTable
DROP TABLE "public"."UserJobContext";

-- CreateTable
CREATE TABLE "public"."InterviewInfo" (
    "id" TEXT NOT NULL,
    "jobDataId" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "feedback" TEXT,
    "score" INTEGER,

    CONSTRAINT "InterviewInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InterviewInfo_jobDataId_key" ON "public"."InterviewInfo"("jobDataId");

-- AddForeignKey
ALTER TABLE "public"."InterviewInfo" ADD CONSTRAINT "InterviewInfo_jobDataId_fkey" FOREIGN KEY ("jobDataId") REFERENCES "public"."JobData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
