-- AlterTable
ALTER TABLE "DesignRequest" ADD COLUMN     "fluteDirection" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "innerLiner" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "outerLiner" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "requireArt" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "RequestClosureType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestClosureType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestFluteType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestFluteType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestFluteDirection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestFluteDirection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestFinishingOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestFinishingOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RequestClosureType_name_key" ON "RequestClosureType"("name");

-- CreateIndex
CREATE INDEX "RequestClosureType_isActive_idx" ON "RequestClosureType"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "RequestFluteType_name_key" ON "RequestFluteType"("name");

-- CreateIndex
CREATE INDEX "RequestFluteType_isActive_idx" ON "RequestFluteType"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "RequestFluteDirection_name_key" ON "RequestFluteDirection"("name");

-- CreateIndex
CREATE INDEX "RequestFluteDirection_isActive_idx" ON "RequestFluteDirection"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "RequestFinishingOption_name_key" ON "RequestFinishingOption"("name");

-- CreateIndex
CREATE INDEX "RequestFinishingOption_isActive_idx" ON "RequestFinishingOption"("isActive");
