import { Client } from '@notionhq/client'
import {
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { EnhancedNotionDatabaseObject } from '@/app/dashboard/page'
import { getServerSession, Session } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/server/db'
import { NotionDateType, NotionProperty } from '@/types/notionTypes'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { EventAttributes } from 'ics'
import { isUserPremium } from '@/utils/stripe'

dayjs.extend(utc)
export const hasNotionDatabases = async () => {
  // @ts-ignore
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }
  if (session && session.user) {
    const user = await prisma.account.findFirst({
      where: {
        userId: session.user?.id,
      },
    })

    const dbs = await prisma.calendar.findMany({
      where: {
        userId: session.user?.id,
      },
      include: {
        CalendarReminder: true,
      },
    })

    if (user && dbs) {
      const client = new Client({ auth: user?.access_token ?? '' })
      const databases = await getDatabasesByName(client)

      return databases.length > 0
    } else {
      return false
    }
  } else {
    return false
  }
}

export const getNotionData = async (
  session: Session,
): Promise<EnhancedNotionDatabaseObject[]> => {
  const user = await prisma.account.findFirst({
    where: {
      userId: session.user?.id,
    },
  })

  const dbs = await prisma.calendar.findMany({
    where: {
      userId: session.user?.id,
    },
    include: {
      CalendarReminder: true,
    },
  })

  if (user && dbs) {
    const client = new Client({ auth: user?.access_token ?? '' })
    const databases = await getDatabasesByName(client)
    const filteredDB =
      (databases.filter(
        (d) => d.object === 'database',
      ) as DatabaseObjectResponse[]) ?? []
    return filteredDB.map((db) => {
      const savedDb = dbs.find((d) => d.databaseId === db.id)

      return {
        ...db,
        configured: !!savedDb,
        calendar: savedDb,
        url: savedDb?.calendarHash ?? '',
      }
    })
  } else {
    return []
  }
}

export const getDatabasesByName = async (
  notion: Client,
): Promise<
  (
    | PageObjectResponse
    | PartialPageObjectResponse
    | PartialDatabaseObjectResponse
    | DatabaseObjectResponse
  )[]
> => {
  const response = await notion.search({
    query: '',
    filter: {
      value: 'database',
      property: 'object',
    },
    sort: {
      direction: 'ascending',
      timestamp: 'last_edited_time',
    },
  })
  return response.results
}

export const getCalendarICSData = async (
  calendarId: string,
  hash: string,
): Promise<EventAttributes[] | null> => {
  const calendar = await prisma.calendar.findFirst({
    where: {
      id: calendarId,
      calendarHash: hash,
    },
    include: {
      CalendarReminder: true,
    },
  })

  const { isPremium } = await isUserPremium(calendar?.userId)

  if (!calendar || (!isPremium && !calendar.primary)) {
    return null
  }

  const account = await prisma.account.findFirst({
    where: {
      userId: calendar.userId,
    },
  })

  if (!account) {
    return null
  } else {
    const client = new Client({ auth: account?.access_token ?? '' })
    const data = (await queryDatabase(
      client,
      calendar.databaseId,
    )) as Array<PageObjectResponse>

    const events: EventAttributes[] = []
    if (data) {
      data.forEach((e) => {
        const dateField = getDateFromDatabase(calendar.dateField, e.properties)
        const title = replaceTagifyIdByValue(calendar.title, e.properties)
        const description = replaceTagifyIdByValue(
          calendar.description,
          e.properties,
        )

        if (!dateField || !title) {
          return
        }

        if (dateField.end) {
          events.push({
            title: title,
            description: description ?? '',
            start: dateField.start,
            end: dateField.end,
            startInputType: 'utc',
            endInputType: 'utc',
          })
        } else if (dateField.duration) {
          events.push({
            title: title,
            description: description ?? '',
            start: dateField.start,
            duration: dateField.duration,
            startInputType: 'utc',
            endInputType: 'utc',
          })
        }
      })
    }
    return events
  }
}
export const queryDatabase = async (notion: Client, databaseId: string) => {
  const response = await notion.databases.query({
    database_id: databaseId,
  })

  return response.results
}

const getDateFromDatabase = (
  id: string,
  properties: NotionProperty,
): NotionDateType | null => {
  const property = Object.values(properties).find((p) => p.id === id)

  if (property?.type === 'date' && property.date) {
    const isFullDay =
      hasNoTime(property.date.start) &&
      (hasNoTime(property.date.end) || !property.date.end)
    const startDate = isFullDay
      ? new Date(property.date.start)
      : dayjs(property.date.start).utc().toDate()
    const event: NotionDateType = {
      start: [
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate(),
      ],
    }

    if (!isFullDay) {
      event['start'].push(startDate.getHours())
      event['start'].push(startDate.getMinutes())
    }

    if (property.date.end) {
      const endDate = isFullDay
        ? dayjs(property.date.end).add(1, 'day').toDate()
        : dayjs(property.date.end).utc().toDate()
      event['end'] = [
        endDate.getFullYear(),
        endDate.getMonth() + 1,
        endDate.getDate(),
      ]

      if (!isFullDay) {
        event['end'].push(endDate.getHours())
        event['end'].push(endDate.getMinutes())
      }
    } else {
      event['duration'] = {
        hours: 24,
        minutes: 0,
      }
    }

    return event
  } else {
    return null
  }
}

interface TagifyString {
  id: string
  title: string
  value: string
  prefix: string
}

const replaceTagifyIdByValue = (
  input: string,
  properties: NotionProperty,
): string => {
  return input.replace(
    /\[\[(.*?)\]\]/gm,
    (_, p1) =>
      getValueFromProperty((JSON.parse(p1) as TagifyString).id, properties) ??
      '',
  )
}

const getValueFromProperty = (
  id: string,
  properties: NotionProperty,
): string | null => {
  const property = Object.values(properties).find((p) => p.id === id)

  if (property?.type === 'number') {
    return String(property.number)
  } else if (property?.type === 'url') {
    return property.url
  } else if (property?.type === 'select') {
    return property.select?.name
  } else if (property?.type === 'multi_select') {
    return property.multi_select.map((s) => s.name).join(', ')
  } else if (property?.type === 'status') {
    return property.status?.name
  } else if (property?.type === 'date') {
    if (property.date) {
      if (property.date.end) {
        return `${dayjs(property.date.start).format('DD-MM-YYYY')} - ${dayjs(
          property.date.end,
        ).format('DD-MM-YYYY')}`
      } else {
        return dayjs(property.date.start).format('DD-MM-YYYY')
      }
    } else {
      return null
    }
  } else if (property?.type === 'email') {
    return property.email
  } else if (property?.type === 'phone_number') {
    return property.phone_number
  } else if (property?.type === 'checkbox') {
    return property.checkbox ? 'true' : 'false'
  } else if (property?.type === 'title') {
    return property.title.length ? property.title[0].plain_text : null
  } else if (property?.type === 'rich_text') {
    return property.rich_text.length ? property.rich_text[0].plain_text : null
  } else {
    return null
  }
}

const hasNoTime = (date: string) => {
  return dayjs(date).hour() === 0 && dayjs(date).minute() === 0
}
