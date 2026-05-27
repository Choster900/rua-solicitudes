-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('CREATED', 'PENDING_DESIGN_REVIEW', 'ASSIGNED_TO_DESIGNER', 'IN_DESIGN', 'SENT_TO_QUALITY', 'QUALITY_REJECTED', 'QUALITY_APPROVED', 'DELIVERED_TO_SALES', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RequestPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "VersionStatus" AS ENUM ('IN_DESIGN', 'SENT_TO_QUALITY', 'REJECTED', 'APPROVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "VersionReason" AS ENUM ('INITIAL', 'QUALITY_REJECTION', 'MANUAL_CORRECTION');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "QualityDecision" AS ENUM ('APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "FileOrigin" AS ENUM ('SALES', 'DESIGN', 'QUALITY');

-- CreateEnum
CREATE TYPE "FileCategory" AS ENUM ('SALES_REFERENCE', 'DESIGN_SOURCE', 'DESIGN_OUTPUT', 'QUALITY_EVIDENCE', 'FINAL_DELIVERABLE', 'OTHER');

-- CreateEnum
CREATE TYPE "WorkflowAction" AS ENUM ('CREATED', 'REVIEWED_BY_DESIGN_LEAD', 'ASSIGNED_DESIGNER', 'SENT_TO_QUALITY', 'QUALITY_REJECTED', 'VERSION_CREATED', 'QUALITY_APPROVED', 'DELIVERED_TO_SALES', 'CANCELLED');

-- CreateTable
CREATE TABLE "AuthUser" (
    "id" TEXT NOT NULL,
    "employeeCode" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "department" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "passwordHash" TEXT NOT NULL,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "lastAccessAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "taxId" TEXT,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "country" TEXT,
    "department" TEXT,
    "city" TEXT,
    "addressLine" TEXT,
    "addressReference" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignRequest" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "priority" "RequestPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "RequestStatus" NOT NULL DEFAULT 'CREATED',
    "requiredDate" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "currentVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignRequestVersion" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "basedOnVersionId" TEXT,
    "createdById" TEXT NOT NULL,
    "reason" "VersionReason" NOT NULL DEFAULT 'INITIAL',
    "status" "VersionStatus" NOT NULL DEFAULT 'IN_DESIGN',
    "materialType" TEXT,
    "materialWeight" TEXT,
    "closureType" TEXT,
    "fluteType" TEXT,
    "fluteDirection" TEXT,
    "outerLiner" TEXT,
    "innerLiner" TEXT,
    "printTechnique" TEXT,
    "colorMode" TEXT,
    "pantoneReferences" TEXT,
    "length" DECIMAL(10,2),
    "width" DECIMAL(10,2),
    "height" DECIMAL(10,2),
    "dimensionUnit" TEXT NOT NULL DEFAULT 'cm',
    "quantity" INTEGER,
    "finishingOptions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "deliverables" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "designInstructions" TEXT NOT NULL DEFAULT '',
    "visualReferences" TEXT NOT NULL DEFAULT '',
    "requireDieCut" BOOLEAN NOT NULL DEFAULT false,
    "requireMockup" BOOLEAN NOT NULL DEFAULT false,
    "submittedToQualityAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignRequestVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestDesignerAssignment" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "designerId" TEXT NOT NULL,
    "assignedById" TEXT NOT NULL,
    "isLeadDesigner" BOOLEAN NOT NULL DEFAULT false,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT NOT NULL DEFAULT '',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "RequestDesignerAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityReview" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "reviewedById" TEXT NOT NULL,
    "decision" "QualityDecision" NOT NULL,
    "generalObservations" TEXT NOT NULL DEFAULT '',
    "checklist" JSONB,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QualityReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestFile" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "versionId" TEXT,
    "uploadedById" TEXT NOT NULL,
    "origin" "FileOrigin" NOT NULL,
    "category" "FileCategory" NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "url" TEXT,
    "checksum" TEXT,
    "notes" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RequestFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestWorkflowEvent" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "versionId" TEXT,
    "actorId" TEXT,
    "action" "WorkflowAction" NOT NULL,
    "fromRequestStatus" "RequestStatus",
    "toRequestStatus" "RequestStatus",
    "fromVersionStatus" "VersionStatus",
    "toVersionStatus" "VersionStatus",
    "comments" TEXT NOT NULL DEFAULT '',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestWorkflowEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_employeeCode_key" ON "AuthUser"("employeeCode");

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_email_key" ON "AuthUser"("email");

-- CreateIndex
CREATE INDEX "AuthUser_status_idx" ON "AuthUser"("status");

-- CreateIndex
CREATE INDEX "AuthUser_department_idx" ON "AuthUser"("department");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_code_key" ON "Role"("code");

-- CreateIndex
CREATE INDEX "Role_code_idx" ON "Role"("code");

-- CreateIndex
CREATE INDEX "Role_isSystem_idx" ON "Role"("isSystem");

-- CreateIndex
CREATE INDEX "UserRole_userId_idx" ON "UserRole"("userId");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_code_key" ON "Client"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Client_taxId_key" ON "Client"("taxId");

-- CreateIndex
CREATE INDEX "Client_name_idx" ON "Client"("name");

-- CreateIndex
CREATE INDEX "Client_isActive_idx" ON "Client"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "DesignRequest_code_key" ON "DesignRequest"("code");

-- CreateIndex
CREATE INDEX "DesignRequest_clientId_idx" ON "DesignRequest"("clientId");

-- CreateIndex
CREATE INDEX "DesignRequest_sellerId_idx" ON "DesignRequest"("sellerId");

-- CreateIndex
CREATE INDEX "DesignRequest_status_idx" ON "DesignRequest"("status");

-- CreateIndex
CREATE INDEX "DesignRequest_priority_idx" ON "DesignRequest"("priority");

-- CreateIndex
CREATE INDEX "DesignRequest_requiredDate_idx" ON "DesignRequest"("requiredDate");

-- CreateIndex
CREATE INDEX "DesignRequest_createdAt_idx" ON "DesignRequest"("createdAt");

-- CreateIndex
CREATE INDEX "DesignRequestVersion_requestId_idx" ON "DesignRequestVersion"("requestId");

-- CreateIndex
CREATE INDEX "DesignRequestVersion_status_idx" ON "DesignRequestVersion"("status");

-- CreateIndex
CREATE INDEX "DesignRequestVersion_basedOnVersionId_idx" ON "DesignRequestVersion"("basedOnVersionId");

-- CreateIndex
CREATE INDEX "DesignRequestVersion_createdById_idx" ON "DesignRequestVersion"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "DesignRequestVersion_requestId_versionNumber_key" ON "DesignRequestVersion"("requestId", "versionNumber");

-- CreateIndex
CREATE INDEX "RequestDesignerAssignment_versionId_idx" ON "RequestDesignerAssignment"("versionId");

-- CreateIndex
CREATE INDEX "RequestDesignerAssignment_designerId_idx" ON "RequestDesignerAssignment"("designerId");

-- CreateIndex
CREATE INDEX "RequestDesignerAssignment_assignedById_idx" ON "RequestDesignerAssignment"("assignedById");

-- CreateIndex
CREATE INDEX "RequestDesignerAssignment_status_idx" ON "RequestDesignerAssignment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "RequestDesignerAssignment_versionId_designerId_key" ON "RequestDesignerAssignment"("versionId", "designerId");

-- CreateIndex
CREATE INDEX "QualityReview_versionId_idx" ON "QualityReview"("versionId");

-- CreateIndex
CREATE INDEX "QualityReview_reviewedById_idx" ON "QualityReview"("reviewedById");

-- CreateIndex
CREATE INDEX "QualityReview_decision_idx" ON "QualityReview"("decision");

-- CreateIndex
CREATE INDEX "QualityReview_reviewedAt_idx" ON "QualityReview"("reviewedAt");

-- CreateIndex
CREATE INDEX "RequestFile_requestId_idx" ON "RequestFile"("requestId");

-- CreateIndex
CREATE INDEX "RequestFile_versionId_idx" ON "RequestFile"("versionId");

-- CreateIndex
CREATE INDEX "RequestFile_uploadedById_idx" ON "RequestFile"("uploadedById");

-- CreateIndex
CREATE INDEX "RequestFile_origin_idx" ON "RequestFile"("origin");

-- CreateIndex
CREATE INDEX "RequestFile_category_idx" ON "RequestFile"("category");

-- CreateIndex
CREATE INDEX "RequestFile_isActive_idx" ON "RequestFile"("isActive");

-- CreateIndex
CREATE INDEX "RequestFile_createdAt_idx" ON "RequestFile"("createdAt");

-- CreateIndex
CREATE INDEX "RequestWorkflowEvent_requestId_idx" ON "RequestWorkflowEvent"("requestId");

-- CreateIndex
CREATE INDEX "RequestWorkflowEvent_versionId_idx" ON "RequestWorkflowEvent"("versionId");

-- CreateIndex
CREATE INDEX "RequestWorkflowEvent_actorId_idx" ON "RequestWorkflowEvent"("actorId");

-- CreateIndex
CREATE INDEX "RequestWorkflowEvent_action_idx" ON "RequestWorkflowEvent"("action");

-- CreateIndex
CREATE INDEX "RequestWorkflowEvent_createdAt_idx" ON "RequestWorkflowEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignRequest" ADD CONSTRAINT "DesignRequest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignRequest" ADD CONSTRAINT "DesignRequest_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "AuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignRequest" ADD CONSTRAINT "DesignRequest_currentVersionId_fkey" FOREIGN KEY ("currentVersionId") REFERENCES "DesignRequestVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignRequestVersion" ADD CONSTRAINT "DesignRequestVersion_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "DesignRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignRequestVersion" ADD CONSTRAINT "DesignRequestVersion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignRequestVersion" ADD CONSTRAINT "DesignRequestVersion_basedOnVersionId_fkey" FOREIGN KEY ("basedOnVersionId") REFERENCES "DesignRequestVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestDesignerAssignment" ADD CONSTRAINT "RequestDesignerAssignment_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "DesignRequestVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestDesignerAssignment" ADD CONSTRAINT "RequestDesignerAssignment_designerId_fkey" FOREIGN KEY ("designerId") REFERENCES "AuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestDesignerAssignment" ADD CONSTRAINT "RequestDesignerAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "AuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityReview" ADD CONSTRAINT "QualityReview_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "DesignRequestVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityReview" ADD CONSTRAINT "QualityReview_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "AuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestFile" ADD CONSTRAINT "RequestFile_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "DesignRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestFile" ADD CONSTRAINT "RequestFile_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "DesignRequestVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestFile" ADD CONSTRAINT "RequestFile_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "AuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestWorkflowEvent" ADD CONSTRAINT "RequestWorkflowEvent_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "DesignRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestWorkflowEvent" ADD CONSTRAINT "RequestWorkflowEvent_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "DesignRequestVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestWorkflowEvent" ADD CONSTRAINT "RequestWorkflowEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "AuthUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
