'use client'

import React from 'react'
import Link from 'next/link'
import { UserIcon, StarIcon, CalendarIcon, SettingsIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'

export default function ProviderAdminPage() {
  const stats = [
    { label: 'Profile views', value: '128', icon: UserIcon, change: '+12%' },
    { label: 'Average rating', value: '4.8', icon: StarIcon, change: '+0.2' },
    { label: 'Bookings this month', value: '8', icon: CalendarIcon, change: '+3' },
  ]

  const recentBookings = [
    { id: '1', client: 'Anonymous', date: '2026-07-10', time: '2:00 PM', status: 'confirmed' },
    { id: '2', client: 'Anonymous', date: '2026-07-12', time: '10:00 AM', status: 'pending' },
    { id: '3', client: 'Anonymous', date: '2026-07-15', time: '3:00 PM', status: 'confirmed' },
  ]

  const statusColors = {
    confirmed: 'bg-success/10 text-success',
    pending: 'bg-warning/10 text-warning',
    cancelled: 'bg-error/10 text-error',
  }

  return (
    <section className="py-8">
      <div className="container">
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Provider Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your profile, reviews, and bookings.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-success">{stat.change}</span>
              </div>
              <p className="mt-3 text-2xl font-heading font-semibold text-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Quick actions
            </h2>
            <div className="mt-4 space-y-2">
              <Link
                href="/provider-admin/profile"
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <UserIcon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Edit profile</p>
                  <p className="text-xs text-muted-foreground">Update your bio, credentials, and approach</p>
                </div>
              </Link>
              <Link
                href="/provider-admin/reviews"
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <StarIcon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Reviews</p>
                  <p className="text-xs text-muted-foreground">View and respond to client reviews</p>
                </div>
              </Link>
              <Link
                href="/provider-admin/bookings"
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <CalendarIcon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Bookings</p>
                  <p className="text-xs text-muted-foreground">Manage your upcoming sessions</p>
                </div>
              </Link>
              <Link
                href="/provider-admin/settings"
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <SettingsIcon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Settings</p>
                  <p className="text-xs text-muted-foreground">Availability, session formats, and preferences</p>
                </div>
              </Link>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Recent bookings
            </h2>
            <div className="mt-4 rounded-xl border border-border bg-card">
              {recentBookings.map((booking, i) => (
                <div
                  key={booking.id}
                  className={cn(
                    'flex items-center justify-between px-4 py-3',
                    i < recentBookings.length - 1 && 'border-b border-border',
                  )}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{booking.client}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.date} at {booking.time}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-medium',
                      statusColors[booking.status as keyof typeof statusColors],
                    )}
                  >
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
