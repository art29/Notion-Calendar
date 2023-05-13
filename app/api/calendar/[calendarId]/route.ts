import { getCalendarICSData } from '@/app/server/notion'
import { NextResponse } from 'next/server'
import { createEvents } from 'ics'
export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { calendarId: string }
  },
) {
  const calendarId = params.calendarId
  const { searchParams } = new URL(request.url)
  const hash = searchParams.get('hash')

  if (!hash) {
    return NextResponse.json({ error: 'missing hash' }, { status: 403 })
  }

  const data = await getCalendarICSData(calendarId.replace('.ics', ''), hash)

  if (data) {
    const { error, value } = createEvents(data)

    if (value) {
      return new Response(
        value.replace('BEGIN:VCALENDAR', 'BEGIN:VCALENDAR\nX-WR-TIMEZONE:UTC'),
        {
          status: 200,
          headers: {
            'Content-Type': 'text/calendar',
          },
        },
      )
    } else {
      return NextResponse.json({ error: 'Cannot get file' })
    }
  } else {
    return NextResponse.json({ error: 'Cannot get file' })
  }
}
