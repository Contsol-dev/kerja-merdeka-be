-- CreateTable
CREATE TABLE "public"."UserJobContext" (
    "id" TEXT NOT NULL,
    "jobDataId" TEXT NOT NULL,
    "context" TEXT NOT NULL,

    CONSTRAINT "UserJobContext_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserJobContext_jobDataId_key" ON "public"."UserJobContext"("jobDataId");

-- AddForeignKey
ALTER TABLE "public"."UserJobContext" ADD CONSTRAINT "UserJobContext_jobDataId_fkey" FOREIGN KEY ("jobDataId") REFERENCES "public"."JobData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
