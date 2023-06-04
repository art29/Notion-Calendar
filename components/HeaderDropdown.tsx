import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { Session } from 'next-auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

interface HeaderDropdownProps {
  session: Session
  isPremium: boolean
}
const HeaderDropdown = ({ session, isPremium }: HeaderDropdownProps) => {
  const [sessionUrl, setSessionUrl] = useState<null | string>(null)

  useEffect(() => {
    if (isPremium) {
      fetch('/api/checkout/session')
        .then((res) => res.json())
        .then((data) => {
          setSessionUrl(data.url)
        })
    } else {
      setSessionUrl(null)
    }
  }, [isPremium])

  return session ? (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="justify-center bg-white px-2 py-1 rounded-md text-gray-800 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
          Hello {session.user.name}
          <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              <Link href={'/dashboard'} className={'block px-4 py-2 text-sm'}>
                Dashboard
              </Link>
            </Menu.Item>
            {isPremium ? (
              sessionUrl && (
                <Menu.Item>
                  <Link href={sessionUrl} className={'block px-4 py-2 text-sm'}>
                    Manage Premium Subscription
                  </Link>
                </Menu.Item>
              )
            ) : (
              <Menu.Item>
                <Link href={'/#pricing'} className={'block px-4 py-2 text-sm'}>
                  Become Premium!
                </Link>
              </Menu.Item>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  ) : (
    <div></div>
  )
}

export default HeaderDropdown
