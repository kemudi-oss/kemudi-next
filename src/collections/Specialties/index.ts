import type { CollectionConfig } from 'payload'

export const Specialties: CollectionConfig = {
  slug: 'specialties',
  admin: {
    defaultColumns: ['title', 'category'],
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
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
      type: 'textarea',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Individual Therapy', value: 'individual' },
        { label: 'Couples Therapy', value: 'couples' },
        { label: 'Family Therapy', value: 'family' },
        { label: 'Group Therapy', value: 'group' },
        { label: 'Psychiatric Services', value: 'psychiatric' },
        { label: 'Child & Adolescent', value: 'child-adolescent' },
        { label: 'Art Therapy', value: 'art' },
        { label: 'EMDR', value: 'emdr' },
        { label: 'CBT', value: 'cbt' },
        { label: 'Crisis Intervention', value: 'crisis' },
      ],
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && data?.title && !data?.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
        }
      },
    ],
  },
  timestamps: true,
}
