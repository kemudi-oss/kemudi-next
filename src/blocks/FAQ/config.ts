import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FAQ: Block = {
  slug: 'faq',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Frequently asked questions',
    },
    {
      name: 'subheading',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        {
          name: 'answer',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
          required: true,
        },
      ],
      minRows: 1,
    },
  ],
}
