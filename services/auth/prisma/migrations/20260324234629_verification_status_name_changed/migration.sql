/*
  Warnings:

  - The values [VERIFIED] on the enum `VerificationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."VerificationStatus_new" AS ENUM ('PENDING', 'USED', 'EXPIRED');
ALTER TABLE "public"."VerificationCode" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."VerificationCode" ALTER COLUMN "status" TYPE "public"."VerificationStatus_new" USING ("status"::text::"public"."VerificationStatus_new");
ALTER TYPE "public"."VerificationStatus" RENAME TO "VerificationStatus_old";
ALTER TYPE "public"."VerificationStatus_new" RENAME TO "VerificationStatus";
DROP TYPE "public"."VerificationStatus_old";
ALTER TABLE "public"."VerificationCode" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
