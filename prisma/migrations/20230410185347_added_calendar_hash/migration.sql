/*
  Warnings:

  - You are about to drop the column `remind_at` on the `CalendarReminder` table. All the data in the column will be lost.
  - Added the required column `calendarHash` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remindAt` to the `CalendarReminder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Calendar" ADD COLUMN     "calendarHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CalendarReminder" DROP COLUMN "remind_at",
ADD COLUMN     "remindAt" INTEGER NOT NULL;
