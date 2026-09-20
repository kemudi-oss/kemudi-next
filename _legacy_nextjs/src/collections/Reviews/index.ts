import type { CollectionConfig } from 'payload'
import { sendReviewNotificationEmail } from '@/utilities/email'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    defaultColumns: ['provider', 'rating', 'status', 'authorName'],
    useAsTitle: 'title',
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      return { status: { equals: 'approved' } }
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
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      required: true,
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'authorName',
      type: 'text',
      admin: {
        description: 'Display name (anonymous-friendly)',
      },
    },
    {
      name: 'authorAge',
      type: 'select',
      options: [
        { label: '18-24', value: '18-24' },
        { label: '25-34', value: '25-34' },
        { label: '35-44', value: '35-44' },
        { label: '45-54', value: '45-54' },
        { label: '55+', value: '55+' },
      ],
    },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      required: true,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return

        try {
          const provider = await req.payload.findByID({
            collection: 'provider-profiles',
            id: typeof doc.provider === 'object' ? doc.provider.id : doc.provider,
            depth: 1,
          })

          const user = typeof provider.user === 'object' ? provider.user : null
          if (!user?.email) return

          await sendReviewNotificationEmail({
            to: user.email,
            providerName: user.name || 'Provider',
            reviewerName: doc.authorName || 'Anonymous',
            rating: doc.rating,
            reviewTitle: doc.title,
          })
        } catch (err) {
          console.error('Failed to send review notification email:', err)
        }
      },
    ],
  },
  timestamps: true,
}
