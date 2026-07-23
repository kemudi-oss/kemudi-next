import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'audienceToggle',
      type: 'group',
      fields: [
        {
          name: 'helpSeekerLabel',
          type: 'text',
          defaultValue: 'For Help Seekers',
        },
        {
          name: 'helpSeekerUrl',
          type: 'text',
          defaultValue: '/',
        },
        {
          name: 'therapistLabel',
          type: 'text',
          defaultValue: 'For Therapists',
        },
        {
          name: 'therapistUrl',
          type: 'text',
          defaultValue: '/for-therapists',
        },
      ],
    },
    {
      name: 'ctaButton',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'List Your Services',
        },
        {
          name: 'url',
          type: 'text',
          defaultValue: '/for-therapists/list',
        },
      ],
    },
    {
      name: 'mobileMenuItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 10,
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
