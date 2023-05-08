'use server'

import 'server-only'
import { getNotionData, hasNotionDatabases } from '@/app/server/notion'
import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import SignInButton from '@/components/SignInButton'
import Alert from '@/components/Alert'
import NotionDatabaseTable from '@/components/NotionDatabaseTable'
import { Calendar, CalendarReminder } from '.prisma/client'
import { isUserPremium } from '@/utils/stripe'
import Link from 'next/link'

export interface EnhancedNotionDatabaseObject extends DatabaseObjectResponse {
  configured: boolean
  calendar?: Calendar & { CalendarReminder: CalendarReminder[] }
  url: string
}

export default async function Dashboard() {
  const hasNotionDb = await hasNotionDatabases()
  const { isPremium } = await isUserPremium()

  return (
    <div className="mx-auto px-4 lg:px-10 w-full lg:w-[80%]">
      <h2 className="text-4xl mb-4 font-medium">Calendar Dashboard</h2>
      {hasNotionDb ? (
        <>
          <NotionDatabaseTable isPremium={isPremium} />
          {!isPremium && (
            <div className="text-sm font-semibold text-gray-600 mb-3">
              Become a{' '}
              <Link
                className="text-black underline underline-offset-4"
                href="/#pricing"
              >
                premium user
              </Link>{' '}
              to access unlimited databases! Until then, you are allowed one
              primary database that will be active.
            </div>
          )}
          <div className="text-sm text-gray-500">
            To add missing databases, click{' '}
            <SignInButton theme="link">here</SignInButton> to give permission to
            use them.
          </div>
        </>
      ) : (
        <Alert>
          <>
            Sorry... No databases are currently linked to Notion Calendar. Click{' '}
            <SignInButton
              theme="link"
              styling="border-red-400 text-red-500 bg-red-100"
            >
              here
            </SignInButton>{' '}
            to link one.
          </>
        </Alert>
      )}
    </div>
  )
}
