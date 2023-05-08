import PricingTable from '@/components/PricingTable'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { isUserPremium } from '@/utils/stripe'

export default async function Home() {
  // @ts-ignore
  const session = await getServerSession(authOptions)
  const { currentPlans } = await isUserPremium()

  return (
    <div className="mx-auto max-w-[50em] px-10 pt-12">
      <h1 className="text-6xl font-semibold text-center mb-4">
        Your Notion Calendar Available Anywhere
      </h1>
      <h2 className="text-lg font-medium text-center">
        Notion Calendar is an easy way to connect your notion calendar anywhere
        (Google Calendar, Outlook and more).
      </h2>
      <PricingTable session={session} currentPlans={currentPlans ?? []} />
    </div>
  )
}
