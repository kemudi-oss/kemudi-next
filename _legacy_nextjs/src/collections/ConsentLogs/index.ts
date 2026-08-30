import type { CollectionConfig } from 'payload'

export const ConsentLogs: CollectionConfig = {
  slug: 'consent-logs',
  admin: {
    defaultColumns: ['user', 'type', 'consentedAt'],
    useAsTitle: 'type',
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => true,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Platform usage', value: 'platform' },
        { label: 'Marketing emails', value: 'marketing' },
        { label: 'Health data processing', value: 'health' },
      ],
    },
    {
      name: 'consented',
      type: 'checkbox',
      required: true,
    },
    {
      name: 'ipAddress',
      type: 'text',
    },
  ],
  timestamps: true,
}
