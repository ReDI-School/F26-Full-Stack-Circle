-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_itemId_fkey";

-- AlterTable
ALTER TABLE "Thread" ALTER COLUMN "itemId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
