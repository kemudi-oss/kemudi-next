import type { CollectionConfig } from 'payload'

export const Interests: CollectionConfig = {
  slug: 'interests',
  admin: {
    defaultColumns: ['email', 'provider', 'createdAt'],
    useAsTitle: 'email',
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: () => true,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'provider',
      type: 'relationship',
      relationTo: 'provider-profiles',
      required: true,
    },
    {
      name: 'notified',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  timestamps: true,
}
