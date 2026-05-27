-- AlterTable
ALTER TABLE "DesignRequestVersion" ADD COLUMN     "artCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "artCompletedAt" TIMESTAMP(3),
ADD COLUMN     "dummyCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dummyCompletedAt" TIMESTAMP(3),
ADD COLUMN     "mechanicalCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mechanicalCompletedAt" TIMESTAMP(3);
