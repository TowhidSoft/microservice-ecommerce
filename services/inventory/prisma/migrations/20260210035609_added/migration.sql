/*
  Warnings:

  - Added the required column `updatedAt` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."History" DROP CONSTRAINT "History_inventoryId_fkey";

-- AlterTable
ALTER TABLE "public"."History" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."History" ADD CONSTRAINT "History_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "public"."Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
