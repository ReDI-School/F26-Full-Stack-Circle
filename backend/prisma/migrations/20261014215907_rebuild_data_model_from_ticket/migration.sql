/*
  Warnings:

  - You are about to drop the column `sortOrder` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `originalPriceCents` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `HomepageRow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HomepageRowItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemImage` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `tint` on the `Category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `sellerId` to the `Thread` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "HomepageRowItem" DROP CONSTRAINT "HomepageRowItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "HomepageRowItem" DROP CONSTRAINT "HomepageRowItem_rowId_fkey";

-- DropForeignKey
ALTER TABLE "ItemImage" DROP CONSTRAINT "ItemImage_itemId_fkey";

-- DropIndex
DROP INDEX "Item_status_idx";

-- DropIndex
DROP INDEX "Shop_slug_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "sortOrder",
DROP COLUMN "tint",
ADD COLUMN     "tint" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "originalPriceCents",
DROP COLUMN "status",
ADD COLUMN     "oldPriceCents" INTEGER,
ADD COLUMN     "sold" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "createdAt",
DROP COLUMN "location",
DROP COLUMN "slug",
DROP COLUMN "updatedAt",
ADD COLUMN     "subline" TEXT;

-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "sellerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "HomepageRow";

-- DropTable
DROP TABLE "HomepageRowItem";

-- DropTable
DROP TABLE "ItemImage";

-- DropEnum
DROP TYPE "ItemStatus";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "ItemPhoto" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "ItemPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeRow" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "HomeRow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeRowItem" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "homeRowId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "HomeRowItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ItemPhoto_itemId_idx" ON "ItemPhoto"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemPhoto_itemId_position_key" ON "ItemPhoto"("itemId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "HomeRow_key_key" ON "HomeRow"("key");

-- CreateIndex
CREATE INDEX "HomeRowItem_itemId_idx" ON "HomeRowItem"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "HomeRowItem_homeRowId_itemId_key" ON "HomeRowItem"("homeRowId", "itemId");

-- CreateIndex
CREATE INDEX "Item_sold_idx" ON "Item"("sold");

-- CreateIndex
CREATE INDEX "Thread_sellerId_idx" ON "Thread"("sellerId");

-- AddForeignKey
ALTER TABLE "ItemPhoto" ADD CONSTRAINT "ItemPhoto_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeRowItem" ADD CONSTRAINT "HomeRowItem_homeRowId_fkey" FOREIGN KEY ("homeRowId") REFERENCES "HomeRow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeRowItem" ADD CONSTRAINT "HomeRowItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
