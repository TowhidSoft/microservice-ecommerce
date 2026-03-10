/*
  Warnings:

  - You are about to drop the column `authUserID` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authUserId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."User_authUserID_idx";

-- DropIndex
DROP INDEX "public"."User_authUserID_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "authUserID",
ADD COLUMN     "authUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_authUserId_key" ON "public"."User"("authUserId");

-- CreateIndex
CREATE INDEX "User_authUserId_idx" ON "public"."User"("authUserId");
