-- DropForeignKey
ALTER TABLE "CalendarReminder" DROP CONSTRAINT "CalendarReminder_calendarId_fkey";

-- AddForeignKey
ALTER TABLE "CalendarReminder" ADD CONSTRAINT "CalendarReminder_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
