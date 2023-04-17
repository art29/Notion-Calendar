import './globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false
export const metadata = {
  title: 'Notion Calendar',
  description: 'Generate ICS Calendar Files from Notion Calendars',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // @ts-ignore
  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <body id="body">
        <main className="flex flex-col min-h-screen">
          <Header session={session} />
          <div className="flex-grow">{children}</div>
          <Footer />
        </main>
      </body>
    </html>
  )
}
