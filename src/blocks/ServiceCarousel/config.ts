import type { Block } from 'payload'

export const ServiceCarousel: Block = {
  slug: 'serviceCarousel',
  labels: {
    singular: 'Service Carousel',
    plural: 'Service Carousels',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'How can we help?',
    },
    {
      name: 'subheading',
      type: 'text',
      defaultValue: 'Browse our services to find the right support for you.',
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'specialties',
      hasMany: true,
    },
    {
      name: 'viewAllLink',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'View all services' },
        { name: 'url', type: 'text', defaultValue: '/providers' },
      ],
    },
  ],
}
