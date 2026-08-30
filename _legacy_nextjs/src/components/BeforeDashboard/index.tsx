import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to Kemudi Admin!</h4>
      </Banner>
      Here&apos;s what to do next:
      <ul className={`${baseClass}__instructions`}>
        <li>
          <SeedButton />
          {' to populate your database with sample providers, bookings, and reviews.'}
        </li>
        <li>
          {'Manage '}
          <a href="/admin/collections/provider-profiles" target="_blank">
            provider profiles
          </a>
          {', '}
          <a href="/admin/collections/bookings" target="_blank">
            bookings
          </a>
          {', and '}
          <a href="/admin/collections/reviews" target="_blank">
            reviews
          </a>
          {' from the collections menu.'}
        </li>
        <li>
          {'Configure '}
          <a href="/admin/globals/site-settings" target="_blank">
            site settings
          </a>
          {' to customize your platform.'}
        </li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
