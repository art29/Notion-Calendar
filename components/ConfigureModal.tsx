'use client'

import Modal from 'react-modal'
import { EnhancedNotionDatabaseObject } from '@/app/dashboard/page'
import Button from '@/components/Button'
import { useCallback, useEffect, useState } from 'react'
import { MixedTags } from '@yaireo/tagify/dist/react.tagify'
import Tagify, { ChangeEventData } from '@yaireo/tagify'
import '@yaireo/tagify/dist/tagify.css'
import { generateTagifyWhitelist, tagifySettings } from '@/utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons'

Modal.setAppElement('#body')

interface ConfigureModalProps {
  database: EnhancedNotionDatabaseObject | null
  closeModal: () => void
}

const ConfigureModal = ({ database, closeModal }: ConfigureModalProps) => {
  const [titleTagifyWhitelist, setTitleTagifyWhitelist] = useState<
    { id: string; title: string; value: string }[]
  >([])
  const [descriptionTagifyWhitelist, setDescriptionTagifyWhitelist] = useState<
    { id: string; title: string; value: string }[]
  >([])
  const [datePropertyList, setDatePropertyList] = useState<
    { id: string; title: string; value: string }[]
  >([])

  useEffect(() => {
    if (database) {
      setTitleTagifyWhitelist(generateTagifyWhitelist(database, 'title'))
      setDescriptionTagifyWhitelist(
        generateTagifyWhitelist(database, 'description'),
      )
      setDatePropertyList(generateTagifyWhitelist(database, 'date'))
    } else {
      setTitleTagifyWhitelist([])
      setDescriptionTagifyWhitelist([])
      setDatePropertyList([])
    }
  }, [database])

  const onChange = useCallback(
    (e: CustomEvent<ChangeEventData<Tagify.TagData>>) => {
      console.log('CHANGED:', e.detail)
    },
    [],
  )

  return (
    <Modal onRequestClose={closeModal} isOpen={!!database}>
      {!!database && (
        <div>
          <div className="flex justify-end">
            <Button type="button" theme="none" onClick={closeModal}>
              <FontAwesomeIcon icon={faXmark} size="lg" />
            </Button>
          </div>
          <div className="w-3/5 flex flex-col mx-auto">
            <h2 className="text-3xl font-medium mb-6">
              Configure {database.title[0].plain_text} Calendar
            </h2>
            <form className="mb-4">
              <div className="mb-6">
                <label className="block text-md font-medium text-gray-900">
                  Event Name
                </label>
                {titleTagifyWhitelist.length > 0 && (
                  <p className="text-sm text-gray-500 mb-4">
                    You can use @ or # symbols to add the properties from your
                    database, as well as regular text; (Ex: #
                    {titleTagifyWhitelist[0].title} will add the{' '}
                    {titleTagifyWhitelist[0].title} from your database)
                  </p>
                )}
                <MixedTags
                  autoFocus={true}
                  settings={tagifySettings}
                  onChange={onChange}
                  whitelist={titleTagifyWhitelist}
                  defaultValue={''}
                  className="rounded"
                />
                <p className="text-sm text-gray-600 mb-2">
                  {titleTagifyWhitelist.length > 0 ? (
                    <>
                      Available Tags:{' '}
                      {titleTagifyWhitelist.map((p) => p.title).join(', ')}
                    </>
                  ) : (
                    <>No available Tags</>
                  )}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-md font-medium text-gray-900 mb-2">
                  Event Date
                </label>

                <select className="w-full p-2 border border-gray-300 rounded">
                  {datePropertyList.map((d, i) => (
                    <option selected={i === 0} key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-600 mb-2">
                  Choose between the available date properties. Make sure there
                  is at least one date property in your database.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-md font-medium text-gray-900">
                  Event Description
                </label>
                {descriptionTagifyWhitelist.length > 0 && (
                  <p className="text-sm text-gray-500 mb-4">
                    You can use @ or # symbols to add the properties from your
                    database, as well as regular text; (Ex: #
                    {descriptionTagifyWhitelist[0].title} will add the{' '}
                    {descriptionTagifyWhitelist[0].title} from your database)
                  </p>
                )}
                <MixedTags
                  autoFocus={true}
                  settings={tagifySettings}
                  onChange={onChange}
                  whitelist={descriptionTagifyWhitelist}
                  defaultValue={''}
                  className="rounded min-h-[5em]"
                />
                <p className="text-sm text-gray-600 mb-2">
                  {descriptionTagifyWhitelist.length > 0 ? (
                    <>
                      Available Tags:{' '}
                      {descriptionTagifyWhitelist
                        .map((p) => p.title)
                        .join(', ')}
                    </>
                  ) : (
                    <>No available Tags</>
                  )}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-md font-medium text-gray-900">
                  Reminders
                </label>
                <div className="flex mb-2">
                  <input
                    type="number"
                    className="w-16 p-2 border border-gray-300 rounded-l"
                  />
                  <select className="p-2 border-r border-y border-gray-300 rounded-r">
                    <option selected value="min">
                      Minutes
                    </option>
                    <option selected value="hour">
                      Hour(s)
                    </option>
                    <option selected value="day">
                      Day(s)
                    </option>
                  </select>
                  <Button styling="ml-2 bg-red-800">
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
                <Button theme="none">Add a new reminder</Button>
              </div>

              <Button theme="dark" type="submit" styling="px-20 py-2">
                Submit
              </Button>
              {
                // Reminder Options (minutes & hours & days) converted all to minutes (Ex: 2h -> 120, 24h -> 1440)
              }
            </form>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default ConfigureModal
