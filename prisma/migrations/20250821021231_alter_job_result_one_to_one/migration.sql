/*
  Warnings:

  - A unique constraint covering the columns `[jobDataId]` on the table `GeneratedResult` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GeneratedResult_jobDataId_key" ON "public"."GeneratedResult"("jobDataId");
