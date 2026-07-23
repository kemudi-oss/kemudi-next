'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarIcon, UsersIcon, ClockIcon, SettingsIcon, ExternalLinkIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface Booking {
  id: string
  datetime: string
  status: string
  user?: { name?: string; email?: string }
  service?: string
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In production, fetch real bookings from API
    // For now, use placeholder data
    setBookings([
      { id: '1', datetime: '2026-07-15T14:00:00', status: 'confirmed', user: { name: 'Client A' }, service: 'Individual Therapy' },
      { id: '2', datetime: '2026-07-16T10:00:00', status: 'pending', user: { name: 'Client B' }, service: 'Couples Therapy' },
    ])
    setLoading(false)
  }, [])

  const stats = [
    { label: 'Upcoming bookings', value: bookings.filter(b => b.status === 'confirmed').length, icon: CalendarIcon },
    { label: 'Pending bookings', value: bookings.filter(b => b.status === 'pending').length, icon: ClockIcon },
    { label: 'Total clients', value: new Set(bookings.map(b => b.user?.email)).size, icon: UsersIcon },
  ]

  const statusColors: Record<string, string> = {
    confirmed: 'bg-success/10 text-success',
    pending: 'bg-warning/10 text-warning',
    cancelled: 'bg-error/10 text-error',
    completed: 'bg-muted text-muted-foreground',
  }

  return (
    <section className="py-8">
      <div className="container">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-semibold text-foreground">Provider Dashboard</h1>
          <Link
            href="/admin"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Payload Admin <ExternalLinkIcon className="h-3 w-3" />
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-semibold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/availability"
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-elevated"
          >
            <CalendarIcon className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-heading font-medium text-foreground">Manage Availability</h3>
              <p className="text-sm text-muted-foreground">Set your weekly schedule and manage bookings</p>
            </div>
          </Link>
          <Link
            href="/dashboard/calendar"
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-elevated"
          >
            <ExternalLinkIcon className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-heading font-medium text-foreground">Google Calendar Sync</h3>
              <p className="text-sm text-muted-foreground">Connect your calendar to avoid double bookings</p>
            </div>
          </Link>
        </div>

        {/* Recent bookings */}
        <div className="mt-8">
          <h2 className="font-heading text-lg font-semibold text-foreground">Recent Bookings</h2>
          {loading ? (
            <p className="mt-4 text-muted-foreground">Loading...</p>
          ) : bookings.length === 0 ? (
            <p className="mt-4 text-muted-foreground">No bookings yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-card"
                >
                  <div>
                    <p className="font-medium text-foreground">{booking.user?.name || 'Anonymous'}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.service} — {new Date(booking.datetime).toLocaleDateString('en-MY', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })} at {new Date(booking.datetime).toLocaleTimeString('en-MY', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium',
                    statusColors[booking.status] || 'bg-muted text-muted-foreground'
                  )}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
