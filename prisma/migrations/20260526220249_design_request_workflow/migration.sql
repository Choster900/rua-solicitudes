-- AlterTable
ALTER TABLE "DesignRequest" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "assignedAt" TIMESTAMP(3),
ADD COLUMN     "assignedById" TEXT,
ADD COLUMN     "assignedDesignerId" TEXT,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "currentVersion" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "DesignRequestVersion" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "designerId" TEXT NOT NULL,
    "artFiles" JSONB NOT NULL DEFAULT '[]',
    "designerNotes" TEXT NOT NULL DEFAULT '',
    "submittedAt" TIMESTAMP(3),
    "reviewStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT NOT NULL DEFAULT '',
    "reviewComments" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignRequestVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignRequestEvent" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "actorId" TEXT,
    "fromStatus" TEXT,
    "toStatus" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignRequestEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DesignRequestVersion_requestId_idx" ON "DesignRequestVersion"("requestId");

-- CreateIndex
CREATE INDEX "DesignRequestVersion_designerId_idx" ON "DesignRequestVersion"("designerId");

-- CreateIndex
CREATE INDEX "DesignRequestVersion_reviewedById_idx" ON "DesignRequestVersion"("reviewedById");

-- CreateIndex
CREATE INDEX "DesignRequestVersion_reviewStatus_idx" ON "DesignRequestVersion"("reviewStatus");

-- CreateIndex
CREATE UNIQUE INDEX "DesignRequestVersion_requestId_versionNumber_key" ON "DesignRequestVersion"("requestId", "versionNumber");

-- CreateIndex
CREATE INDEX "DesignRequestEvent_requestId_idx" ON "DesignRequestEvent"("requestId");

-- CreateIndex
CREATE INDEX "DesignRequestEvent_eventType_idx" ON "DesignRequestEvent"("eventType");

-- CreateIndex
CREATE INDEX "DesignRequestEvent_actorId_idx" ON "DesignRequestEvent"("actorId");

-- CreateIndex
CREATE INDEX "DesignRequestEvent_createdAt_idx" ON "DesignRequestEvent"("createdAt");

-- CreateIndex
CREATE INDEX "AuthUser_userType_idx" ON "AuthUser"("userType");

-- CreateIndex
CREATE INDEX "DesignRequest_createdById_idx" ON "DesignRequest"("createdById");

-- CreateIndex
CREATE INDEX "DesignRequest_assignedDesignerId_idx" ON "DesignRequest"("assignedDesignerId");

-- CreateIndex
CREATE INDEX "DesignRequest_assignedById_idx" ON "DesignRequest"("assignedById");

-- CreateIndex
CREATE INDEX "DesignRequest_approvedById_idx" ON "DesignRequest"("approvedById");

-- AddForeignKey
ALTER TABLE "DesignRequest" ADD CONSTRAINT "DesignRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignRequest" ADD CONSTRAINT "DesignRequest_assignedDesignerId_fkey" FOREIGN KEY ("assignedDesignerId") REFERENCES "AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignRequest" ADD CONSTRAINT "DesignRequest_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignRequest" ADD CONSTRAINT "DesignRequest_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignRequestVersion" ADD CONSTRAINT "DesignRequestVersion_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "DesignRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignRequestVersion" ADD CONSTRAINT "DesignRequestVersion_designerId_fkey" FOREIGN KEY ("designerId") REFERENCES "AuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignRequestVersion" ADD CONSTRAINT "DesignRequestVersion_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignRequestEvent" ADD CONSTRAINT "DesignRequestEvent_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "DesignRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignRequestEvent" ADD CONSTRAINT "DesignRequestEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
