import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { adminOnly, providerOwn, publicReadApproved } from './access'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: adminOnly,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'client',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Provider', value: 'provider' },
        { label: 'Client', value: 'client' },
      ],
      required: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'phone',
      type: 'text',
    },
  ],
  timestamps: true,
}
