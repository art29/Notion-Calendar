'use client'

import { signIn, signOut } from 'next-auth/react'
import Button from '@/components/Button'
import { Session } from 'next-auth'
import Link from 'next/link'
import Image from 'next/image'
import HeaderDropdown from '@/components/HeaderDropdown'

interface HeaderProps {
  session: Session | null
  isPremium: boolean
}

const Header = ({ session, isPremium }: HeaderProps) => {
  return (
    <div className="flex flex-col gap-y-2 lg:gap-y-0 lg:flex-row lg:justify-between py-3 px-5">
      <div className="flex items-center gap-x-3">
        <Link href="/" className="w-10 h-10 flex items-center">
          <Image src={'/logo.png'} width={35} height={35} alt="Logo" />
        </Link>
        <Link href="/" className="text-black">
          Notion Calendar
        </Link>
        <Link href="#pricing" className="text-black">
          Pricing
        </Link>
        <Link href="/resources" className="text-black">
          Resources
        </Link>
      </div>
      <div className="flex items-center gap-x-3 justify-center lg:justify-start">
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
            <HeaderDropdown session={session} isPremium={isPremium} />
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
