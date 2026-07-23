import type { CollectionConfig } from 'payload'

export const Languages: CollectionConfig = {
  slug: 'languages',
  admin: {
    defaultColumns: ['name', 'code'],
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'ISO 639-1 language code (e.g. en, ms, zh, ta)',
      },
    },
  ],
}
