'use client'

import { ReactElement } from 'react'
import { Disclosure } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

interface AccordionPanelProps {
  questionText: string
  children: ReactElement
}

const AccordionPanel = ({ questionText, children }: AccordionPanelProps) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-300 px-4 py-2 text-left text-sm font-medium hover:bg-gray-300 focus:outline-none focus-visible:ring ocus-visible:ring-opacity-75">
            <span>{questionText}</span>
            <FontAwesomeIcon icon={open ? faChevronDown : faChevronUp} />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pb-2 text-sm text-gray-500">
            {children}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default AccordionPanel
