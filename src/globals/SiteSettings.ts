import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'inductionCourseRepeatMonths',
      type: 'number',
      defaultValue: 6,
      admin: {
        description: 'Number of months before showing induction course again',
      },
    },
    {
      name: 'slotReservationMinutes',
      type: 'number',
      defaultValue: 10,
      admin: {
        description: 'Minutes a reserved slot is held before release',
      },
    },
  ],
}
