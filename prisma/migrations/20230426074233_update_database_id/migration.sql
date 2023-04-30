/*
  Warnings:

  - You are about to drop the column `database_id` on the `Calendar` table. All the data in the column will be lost.
  - Added the required column `databaseId` to the `Calendar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Calendar" DROP COLUMN "database_id",
ADD COLUMN     "databaseId" TEXT NOT NULL;
