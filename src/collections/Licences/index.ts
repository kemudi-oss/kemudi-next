import type { CollectionConfig } from 'payload'

export const Licences: CollectionConfig = {
  slug: 'licenses',
  admin: {
    defaultColumns: ['type', 'number', 'issuingBody', 'expiryDate'],
    useAsTitle: 'type',
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user?.role === 'provider') {
        return { provider: { equals: req.user.id } } as any
      }
      return false
    },
  },
  fields: [
    {
      name: 'provider',
      type: 'relationship',
      relationTo: 'provider-profiles',
      required: true,
    },
    {
      name: 'type',
      type: 'text',
      required: true,
    },
    {
      name: 'number',
      type: 'text',
      required: true,
    },
    {
      name: 'issuingBody',
      type: 'text',
      required: true,
    },
    {
      name: 'proof',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'expiryDate',
      type: 'date',
      required: true,
    },
  ],
  timestamps: true,
}
