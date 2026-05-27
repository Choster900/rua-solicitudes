-- 1. Rename password -> passwordHash
ALTER TABLE "AuthUser" RENAME COLUMN "password" TO "passwordHash";

-- 2. Drop userType column (and its index)
DROP INDEX IF EXISTS "AuthUser_userType_idx";
ALTER TABLE "AuthUser" DROP COLUMN IF EXISTS "userType";

-- 3. Re-wire UserRole -> AuthUser (drop FK to User, add FK to AuthUser)
ALTER TABLE "UserRole" DROP CONSTRAINT IF EXISTS "UserRole_userId_fkey";
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 4. Drop orphaned User table (was unused)
DROP TABLE IF EXISTS "User";
