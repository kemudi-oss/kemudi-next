'use client'

import React, { useState } from 'react'
import { BarChart3Icon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'

type DateRange = '7d' | '30d' | '90d' | '12m'

const dateRanges: { label: string; value: DateRange }[] = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: '12 months', value: '12m' },
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  // Placeholder data - in production, this would come from PostHog Insights API
  const stats = [
    { label: 'Profile views', value: 245, change: 12, trend: 'up' },
    { label: 'Search appearances', value: 1820, change: 8, trend: 'up' },
    { label: 'Match appearances', value: 340, change: -3, trend: 'down' },
    { label: 'Booking conversion', value: '4.2%', change: 0.5, trend: 'up' },
  ]

  const recentBookings = [
    { date: '2026-07-10', source: 'search', status: 'completed' },
    { date: '2026-07-12', source: 'match', status: 'pending' },
    { date: '2026-07-15', source: 'direct', status: 'completed' },
  ]

  return (
    <section className="py-8">
      <div className="container">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-semibold text-foreground">Analytics</h1>
          <div className="flex gap-2">
            {dateRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setDateRange(range.value)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  dateRange === range.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-heading font-semibold text-foreground">{stat.value}</span>
                <span className={cn(
                  'flex items-center gap-0.5 text-xs font-medium',
                  stat.trend === 'up' ? 'text-success' : 'text-error',
                )}>
                  {stat.trend === 'up' ? (
                    <TrendingUpIcon className="h-3 w-3" />
                  ) : (
                    <TrendingDownIcon className="h-3 w-3" />
                  )}
                  {stat.change > 0 ? '+' : ''}{stat.change}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts placeholder */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-heading font-medium text-foreground">Booking trend</h3>
            <div className="mt-4 flex h-48 items-end gap-2">
              {[40, 65, 45, 80, 55, 70, 90].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-primary/20"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-heading font-medium text-foreground">Source breakdown</h3>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Search', value: 45, color: 'bg-primary' },
                { label: 'Match quiz', value: 30, color: 'bg-mist-sage' },
                { label: 'Direct', value: 15, color: 'bg-clay-rose' },
                { label: 'Comparison', value: 10, color: 'bg-warm-sand' },
              ].map((source) => (
                <div key={source.label} className="flex items-center gap-3">
                  <span className="w-20 text-sm text-muted-foreground">{source.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted">
                    <div className={cn('h-full rounded-full', source.color)} style={{ width: `${source.value}%` }} />
                  </div>
                  <span className="w-10 text-right text-sm text-muted-foreground">{source.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent bookings */}
        <div className="mt-8">
          <h3 className="font-heading font-medium text-foreground">Recent bookings</h3>
          <div className="mt-4 space-y-2">
            {recentBookings.map((booking, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <div>
                  <p className="text-sm text-foreground">{booking.date}</p>
                  <p className="text-xs text-muted-foreground">Source: {booking.source}</p>
                </div>
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  booking.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning',
                )}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
