'use client'

import Button from '@/components/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faLink,
  faLinkSlash,
  faWrench,
} from '@fortawesome/free-solid-svg-icons'
import { EnhancedNotionDatabaseObject } from '@/app/dashboard/page'
import { useState } from 'react'
import ConfigureModal from '@/components/ConfigureModal'

interface NotionDatabaseTableProps {
  data: EnhancedNotionDatabaseObject[]
}

const NotionDatabaseTable = ({ data }: NotionDatabaseTableProps) => {
  const [selectedDatabase, setSelectedDatabase] =
    useState<EnhancedNotionDatabaseObject | null>(null)

  return (
    <>
      <div className="my-3">
        <div className="relative overflow-x-auto shadow-sm rounded-lg">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-700 uppercase bg-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Database Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Calendar URL
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.id} className="bg-white border-b">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    <div
                      className={`rounded-full h-4 w-4 shadow-lg ${
                        d.configured ? 'bg-green-700' : 'bg-red-700'
                      }`}
                    ></div>
                  </th>
                  <td className="px-6 py-4">{d.title[0].plain_text}</td>
                  <td className="px-6 py-4">
                    {d.configured ? (
                      <Button theme="link" styling="px-0">
                        <>
                          Link
                          <FontAwesomeIcon className="pl-1" icon={faLink} />
                        </>
                      </Button>
                    ) : (
                      <FontAwesomeIcon
                        className="pl-1 text-red-700 text-lg"
                        icon={faLinkSlash}
                      />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={() => setSelectedDatabase(d)}
                      theme="link"
                      styling="px-0"
                    >
                      <div className="flex items-center">
                        {d.configured ? (
                          <>
                            Edit
                            <FontAwesomeIcon className="pl-1" icon={faEdit} />
                          </>
                        ) : (
                          <>
                            Configure
                            <FontAwesomeIcon className="pl-1" icon={faWrench} />
                          </>
                        )}
                      </div>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfigureModal
        database={selectedDatabase}
        closeModal={() => setSelectedDatabase(null)}
      />
    </>
  )
}

export default NotionDatabaseTable
