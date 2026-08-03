/*
  Warnings:

  - You are about to drop the column `userId` on the `residents` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "residents" DROP CONSTRAINT "residents_userId_fkey";

-- DropIndex
DROP INDEX "residents_userId_key";

-- AlterTable
ALTER TABLE "residents" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "residents" ADD CONSTRAINT "residents_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
