import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonial',
    plural: 'Testimonials',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'What people are saying',
    },
    {
      name: 'testimonials',
      type: 'array',
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'context', type: 'text' },
        { name: 'avatar', type: 'upload', relationTo: 'media' },
      ],
      minRows: 1,
      maxRows: 10,
    },
  ],
}
