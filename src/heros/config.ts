import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Search Hero',
          value: 'searchHero',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'searchPlaceholder',
      type: 'text',
      defaultValue: 'What are you looking for?',
      admin: {
        condition: (_, { type } = {}) => type === 'searchHero',
      },
    },
    {
      name: 'suggestions',
      type: 'array',
      admin: {
        condition: (_, { type } = {}) => type === 'searchHero',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
      maxRows: 6,
    },
    {
      name: 'backgroundBlob',
      type: 'select',
      admin: {
        condition: (_, { type } = {}) => type === 'searchHero',
      },
      options: [
        { label: 'Mist Sage', value: 'mistSage' },
        { label: 'Warm Sand', value: 'warmSand' },
        { label: 'None', value: 'none' },
      ],
      defaultValue: 'mistSage',
    },
  ],
  label: false,
}
