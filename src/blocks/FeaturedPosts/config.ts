import type { Block } from 'payload'

export const FeaturedPosts: Block = {
  slug: 'featuredPosts',
  labels: {
    singular: 'Featured Posts',
    plural: 'Featured Posts',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Latest articles',
    },
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      maxRows: 3,
    },
    {
      name: 'viewAllLink',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'View all articles' },
        { name: 'url', type: 'text', defaultValue: '/posts' },
      ],
    },
  ],
}
