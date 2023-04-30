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
import { faTrash, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import fetch from 'node-fetch'
import { CalendarReminder } from '.prisma/client'

Modal.setAppElement('#body')

interface ConfigureModalProps {
  database: EnhancedNotionDatabaseObject | null
  refreshDatabases: () => void
  closeModal: () => void
}

export interface Reminder {
  duration: number
  unit: 'min' | 'hour' | 'day'
  id: number | string
}

interface ConfigureDatabaseEventForm {
  event_name: string
  event_date: string
  event_description: string
  reminders: Reminder[]
}

const databaseFormSchema = z
  .object({
    event_name: z.string(),
    event_date: z.string(),
    event_description: z.string(),
    reminders: z
      .array(
        z.object({
          duration: z.number(),
          unit: z.union([
            z.literal('min'),
            z.literal('hour'),
            z.literal('day'),
          ]),
          id: z.number().or(z.string()),
        }),
      )
      .min(0),
  })
  .required()

const generateReminderFromModel = (r: CalendarReminder): Reminder => {
  if (r.remindAt < 60) {
    return {
      id: r.id,
      duration: r.remindAt,
      unit: 'min',
    }
  } else if (r.remindAt < 3600) {
    return {
      id: r.id,
      duration: r.remindAt / 60,
      unit: 'hour',
    }
  } else {
    return {
      id: r.id,
      duration: r.remindAt / 3600,
      unit: 'day',
    }
  }
}

const ConfigureModal = ({
  database,
  refreshDatabases,
  closeModal,
}: ConfigureModalProps) => {
  const [reminders, setReminders] = useState<Reminder[]>(
    database?.calendar
      ? database.calendar.CalendarReminder.map((r) =>
          generateReminderFromModel(r),
        )
      : [],
  )
  const { register, handleSubmit, setValue, formState } =
    useForm<ConfigureDatabaseEventForm>({
      defaultValues: {
        ...(database?.configured && database.calendar
          ? {
              event_name: database.calendar.title,
              event_date: database.calendar.dateField,
              event_description: database.calendar.description,
              reminders: database.calendar.CalendarReminder.map((r) =>
                generateReminderFromModel(r),
              ),
            }
          : {
              reminders: [],
            }),
      },
      resolver: zodResolver(databaseFormSchema),
    })

  const [titleTagifyWhitelist, setTitleTagifyWhitelist] = useState<
    { id: string; title: string; value: string }[]
  >([])
  const [descriptionTagifyWhitelist, setDescriptionTagifyWhitelist] = useState<
    { id: string; title: string; value: string }[]
  >([])
  const [datePropertyList, setDatePropertyList] = useState<
    { id: string; title: string; value: string }[]
  >([])
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    setDataLoaded(false)
    if (database) {
      setTitleTagifyWhitelist(generateTagifyWhitelist(database, 'title'))
      setDescriptionTagifyWhitelist(
        generateTagifyWhitelist(database, 'description'),
      )
      const dateProperties = generateTagifyWhitelist(database, 'date')
      if (dateProperties.length && !database.configured) {
        setValue('event_date', dateProperties[0].id, { shouldValidate: true })
      }
      setDatePropertyList(dateProperties)
      if (database.calendar && database.configured) {
        setReminders(
          database.calendar.CalendarReminder.map((r) =>
            generateReminderFromModel(r),
          ),
        )
      }
      setDataLoaded(true)
    } else {
      setTitleTagifyWhitelist([])
      setDescriptionTagifyWhitelist([])
      setDatePropertyList([])
    }
  }, [database, setValue])

  const onTagifyChange = useCallback(
    (
      e: CustomEvent<ChangeEventData<Tagify.TagData>>,
      field: 'event_name' | 'event_description',
    ) => {
      setValue(field, e.detail.value.trim(), { shouldValidate: true })
    },
    [setValue],
  )

  const updateReminder = (r: Reminder) => {
    const updatedReminders = reminders.map((re) =>
      re.id === r.id ? { ...r } : re,
    )
    setReminders(updatedReminders)
    setValue('reminders', updatedReminders)
  }

  const onSubmit = (data: ConfigureDatabaseEventForm) => {
    if (database) {
      fetch('/api/databases', {
        body: JSON.stringify({
          ...data,
          ...{
            databaseId: database.id,
            calendarId: database.calendar?.id ?? undefined,
          },
        }),
        method: 'POST',
      }).then(async (r) => {
        if (r) {
          await refreshDatabases()
          closeModal()
        }
      })
    }
  }

  return (
    <Modal onRequestClose={closeModal} isOpen={!!database}>
      {dataLoaded && database && (
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
            <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
              <div className="mb-6">
                <label className="block text-md font-medium text-gray-900">
                  Event Name <span className="text-red-700">*</span>
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
                  onChange={(event) => onTagifyChange(event, 'event_name')}
                  whitelist={titleTagifyWhitelist}
                  defaultValue={
                    database?.calendar ? database.calendar.title : ''
                  }
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
                  Event Date <span className="text-red-700">*</span>
                </label>

                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  {...register('event_date')}
                  defaultValue={
                    datePropertyList.length ? datePropertyList[0].id : ''
                  }
                >
                  {datePropertyList.map((d) => (
                    <option key={d.id} value={d.id}>
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
                  onChange={(event) =>
                    onTagifyChange(event, 'event_description')
                  }
                  whitelist={descriptionTagifyWhitelist}
                  defaultValue={
                    database?.configured && database.calendar
                      ? database.calendar.description
                      : ''
                  }
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
                {reminders.map((r) => (
                  <div key={r.id} className="flex mb-2">
                    <input
                      onChange={(e) =>
                        updateReminder({
                          unit: r.unit,
                          id: r.id,
                          duration: Number(e.target.value),
                        })
                      }
                      type="number"
                      className="w-16 p-2 border border-gray-300 rounded-l"
                      value={r.duration}
                    />
                    <select
                      className="p-2 border-r border-y border-gray-300 rounded-r"
                      onChange={(e) =>
                        updateReminder({
                          unit: e.target.value as 'min' | 'hour' | 'day',
                          id: r.id,
                          duration: r.duration,
                        })
                      }
                      value={r.unit}
                    >
                      <option value="min">Minutes</option>
                      <option value="hour">Hour(s)</option>
                      <option value="day">Day(s)</option>
                    </select>
                    <Button
                      styling="ml-2 bg-red-800"
                      type="button"
                      onClick={() => {
                        const rs = reminders.filter((re) => re.id !== r.id)
                        setReminders(rs)
                        setValue('reminders', rs)
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() =>
                    setReminders([
                      ...reminders,
                      { unit: 'min', duration: 30, id: reminders.length },
                    ])
                  }
                  type="button"
                  theme="none"
                >
                  Add a new reminder
                </Button>
              </div>

              <Button
                disabled={!formState.isValid}
                theme="dark"
                type="submit"
                styling="px-20 py-2"
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default ConfigureModal
