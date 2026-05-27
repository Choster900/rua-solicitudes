/*
  Warnings:

  - You are about to drop the column `checksum` on the `RequestFile` table. All the data in the column will be lost.
  - You are about to drop the column `fileName` on the `RequestFile` table. All the data in the column will be lost.
  - You are about to drop the column `storageKey` on the `RequestFile` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `RequestFile` table. All the data in the column will be lost.
  - Added the required column `base64Content` to the `RequestFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RequestFile" DROP COLUMN "checksum",
DROP COLUMN "fileName",
DROP COLUMN "storageKey",
DROP COLUMN "url",
ADD COLUMN     "base64Content" TEXT NOT NULL;
