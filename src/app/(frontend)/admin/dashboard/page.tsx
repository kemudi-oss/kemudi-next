'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { UsersIcon, CalendarIcon, BarChart3Icon, ChevronDownIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface Provider {
  id: string | number
  title: string
  user?: { name?: string; email?: string }
  status?: string
}

export default function AdminDashboardPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedProviderId = searchParams.get('provider') || ''
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProviders() {
      try {
        const res = await fetch('/api/provider-profiles?limit=100&depth=1')
        const data = await res.json()
        setProviders(data.docs || [])
      } catch (error) {
        console.error('Failed to load providers:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProviders()
  }, [])

  const selectedProvider = providers.find((p) => String(p.id) === selectedProviderId)

  const stats = [
    { label: 'Total providers', value: providers.length, icon: UsersIcon },
    { label: 'Approved', value: providers.filter((p) => p.status === 'approved').length, icon: UsersIcon },
    { label: 'Pending approval', value: providers.filter((p) => p.status === 'pending').length, icon: CalendarIcon },
  ]

  return (
    <section className="py-8">
      <div className="container">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-semibold text-foreground">Admin Dashboard</h1>
          <Link
            href="/admin"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Payload Admin →
          </Link>
        </div>

        {/* Provider selector */}
        <div className="mt-6 rounded-xl border border-border bg-card p-4 shadow-card">
          <label className="text-sm font-medium text-foreground">View as provider</label>
          <div className="mt-2 relative">
            <select
              value={selectedProviderId}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams)
                if (e.target.value) {
                  params.set('provider', e.target.value)
                } else {
                  params.delete('provider')
                }
                router.push(`/admin/dashboard?${params.toString()}`)
              }}
              className="w-full appearance-none rounded-lg border border-border bg-background px-4 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All providers (overview)</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.user?.name || provider.title} ({provider.status})
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
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

        {/* Analytics section */}
        <div className="mt-8">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            {selectedProvider ? `Analytics for ${selectedProvider.user?.name || selectedProvider.title}` : 'Provider Overview'}
          </h2>
          <div className="mt-4 rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3 text-muted-foreground">
              <BarChart3Icon className="h-5 w-5" />
              <p className="text-sm">
                {selectedProviderId
                  ? 'Showing analytics for selected provider. Connect PostHog to see real data.'
                  : 'Select a provider above to view their analytics.'}
              </p>
            </div>
          </div>
        </div>

        {/* Recent providers */}
        <div className="mt-8">
          <h2 className="font-heading text-lg font-semibold text-foreground">Recent Providers</h2>
          <div className="mt-4 space-y-2">
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : providers.length === 0 ? (
              <p className="text-muted-foreground">No providers found.</p>
            ) : (
              providers.slice(0, 10).map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{provider.user?.name || 'Therapist'}</p>
                    <p className="text-sm text-muted-foreground">{provider.title}</p>
                  </div>
                  <span className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    provider.status === 'approved' ? 'bg-success/10 text-success' :
                    provider.status === 'pending' ? 'bg-warning/10 text-warning' :
                    'bg-muted text-muted-foreground',
                  )}>
                    {provider.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
