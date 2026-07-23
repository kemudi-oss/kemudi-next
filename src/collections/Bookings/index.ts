import type { CollectionConfig } from 'payload'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    defaultColumns: ['provider', 'service', 'dateTime', 'bookingStatus', 'clientEmail'],
    useAsTitle: 'clientEmail',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user?.role === 'provider') {
        return {
          provider: {
            in: req.user.id,
          },
        }
      }
      return false
    },
    create: () => true,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'provider',
      type: 'relationship',
      relationTo: 'provider-profiles',
      required: true,
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'specialties',
    },
    {
      name: 'dateTime',
      type: 'date',
      required: true,
    },
    {
      name: 'duration',
      type: 'number',
      defaultValue: 50,
      admin: {
        description: 'Session duration in minutes',
      },
    },
    {
      name: 'format',
      type: 'select',
      options: [
        { label: 'Online', value: 'online' },
        { label: 'In-Person', value: 'in-person' },
      ],
    },
    {
      name: 'bookingStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Completed', value: 'completed' },
      ],
      required: true,
    },
    {
      name: 'clientName',
      type: 'text',
    },
    {
      name: 'clientEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'clientPhone',
      type: 'text',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'intakeFormResponse',
      type: 'richText',
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'calendarInviteSent',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  timestamps: true,
}
