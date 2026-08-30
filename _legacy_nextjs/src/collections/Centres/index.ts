import type { CollectionConfig } from 'payload'

export const Centres: CollectionConfig = {
  slug: 'centres',
  admin: {
    defaultColumns: ['name', 'address'],
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
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'photos',
      type: 'array',
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
      maxRows: 10,
    },
    {
      name: 'address',
      type: 'text',
      required: true,
    },
    {
      name: 'mapCoordinates',
      type: 'group',
      fields: [
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
    {
      name: 'directions',
      type: 'richText',
    },
    {
      name: 'therapists',
      type: 'relationship',
      relationTo: 'provider-profiles',
      hasMany: true,
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && data?.name && !data?.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
        }
      },
    ],
  },
  timestamps: true,
}
