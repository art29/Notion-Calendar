import { TagifySettings } from '@yaireo/tagify'
import { EnhancedNotionDatabaseObject } from '@/app/dashboard/page'

export const tagifySettings: TagifySettings = {
  mode: 'mix',
  pattern: /@|#/,
  dropdown: {
    enabled: 0,
    maxItems: 3,
    position: 'text',
  },
  duplicates: true,
  enforceWhitelist: true,
}

export const generateTagifyWhitelist = (
  database: EnhancedNotionDatabaseObject,
  type: 'title' | 'date' | 'description',
) => {
  const ALLOWED_PROPERTIES = {
    title: [
      'date',
      'email',
      'number',
      'phone_number',
      'select',
      'status',
      'title',
    ],
    description: [
      'date',
      'email',
      'number',
      'phone_number',
      'select',
      'rich_text',
      'status',
      'title',
      'url',
    ],
    date: ['date'],
  }

  return Object.values(database.properties)
    .filter((p) => ALLOWED_PROPERTIES[type].includes(p.type))
    .map((p) => {
      return {
        id: p.id,
        title: p.name,
        value: p.name,
      }
    })
}

interface TagifyString {
  id: string
  title: string
  value: string
  prefix: string
}

const getTagifyIdFromString = (input: string) => {
  return (
    input
      .match(/\[\[(.*?)\]\]/gm)
      ?.map((m: string) => (JSON.parse(m) as TagifyString).id) ?? []
  )
}
