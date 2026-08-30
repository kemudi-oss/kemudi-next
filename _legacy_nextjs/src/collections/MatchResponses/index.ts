import type { CollectionConfig } from 'payload'

export const MatchResponses: CollectionConfig = {
  slug: 'match-responses',
  admin: {
    defaultColumns: ['recommendedProvider', 'timestamp'],
    useAsTitle: 'sessionId',
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => true,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'responses',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'text', required: true },
      ],
    },
    {
      name: 'recommendedProvider',
      type: 'relationship',
      relationTo: 'provider-profiles',
    },
    {
      name: 'runnerUpProviders',
      type: 'relationship',
      relationTo: 'provider-profiles',
      hasMany: true,
    },
    {
      name: 'sessionId',
      type: 'text',
    },
    {
      name: 'timestamp',
      type: 'date',
    },
  ],
  timestamps: true,
}
