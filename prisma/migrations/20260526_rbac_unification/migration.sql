-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT IF EXISTS "UserRole_userId_fkey";

-- DropTable
DROP TABLE IF EXISTS "User";

-- AlterTable: AuthUser column rename + drop userType
ALTER TABLE "AuthUser" RENAME COLUMN "password" TO "passwordHash";
ALTER TABLE "AuthUser" DROP COLUMN IF EXISTS "userType";

-- AddForeignKey: UserRole.userId -> AuthUser.id
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
