'use client'

import { signIn, signOut } from 'next-auth/react'
import Button from '@/components/Button'
import { Session } from 'next-auth'
import Link from 'next/link'

interface HeaderProps {
  session: Session | null
}

const Header = ({ session }: HeaderProps) => {
  // TODO: Make responsive
  // TODO: Create a suitable Logo

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between py-3 px-5">
      <div className="flex items-center gap-x-3">
        <Link href="/" className="w-10 h-10 bg-black">
          Logo
        </Link>
        <Link href="/" className="text-black">
          Notion Calendar
        </Link>
        <Link href="#product" className="text-black">
          Product
        </Link>
        <Link href="#pricing" className="text-black">
          Pricing
        </Link>
        <Link href="#resources" className="text-black">
          Resources
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        {!session ? (
          <>
            <Button
              theme={'none'}
              type={'button'}
              styling={'text-black'}
              onClick={() => signIn('notion')}
            >
              Sign-In
            </Button>
            <Button
              theme={'dark'}
              type={'button'}
              onClick={() => signIn('notion')}
            >
              Sign-Up
            </Button>
          </>
        ) : (
          <>
            <Link href="/dashboard">Hello {session.user?.name ?? ''}</Link>
            <Button theme={'dark'} type={'button'} onClick={() => signOut()}>
              Sign-Out
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default Header
