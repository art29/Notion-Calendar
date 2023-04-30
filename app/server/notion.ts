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

export const hasNotionDatabases = async () => {
  // @ts-ignore
  const session = await getServerSession(authOptions)
  if (!session) {
    // TODO: Add callback URL
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
    return session.user.id && dbs.length > 0
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

export const queryDatabase = async (notion: Client, databaseId: string) => {
  const response = await notion.databases.query({
    database_id: databaseId,
  })

  return response.results
}
