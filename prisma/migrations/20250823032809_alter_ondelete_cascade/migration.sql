-- DropForeignKey
ALTER TABLE "public"."GeneratedResult" DROP CONSTRAINT "GeneratedResult_jobDataId_fkey";

-- DropForeignKey
ALTER TABLE "public"."InterviewLog" DROP CONSTRAINT "InterviewLog_jobDataId_fkey";

-- AddForeignKey
ALTER TABLE "public"."GeneratedResult" ADD CONSTRAINT "GeneratedResult_jobDataId_fkey" FOREIGN KEY ("jobDataId") REFERENCES "public"."JobData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InterviewLog" ADD CONSTRAINT "InterviewLog_jobDataId_fkey" FOREIGN KEY ("jobDataId") REFERENCES "public"."JobData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
