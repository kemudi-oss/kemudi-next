'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, StarIcon, MapPinIcon, VideoIcon, Loader2Icon } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { getProvidersForComparison } from './actions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Provider = any

export default function ComparePage() {
  const searchParams = useSearchParams()
  const ids = searchParams.get('ids')?.split(',') || []
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProviders() {
      if (ids.length === 0) {
        setLoading(false)
        return
      }

      // Enforce max 4
      const validIds = ids.slice(0, 4)

      try {
        const data = await getProvidersForComparison(validIds)
        setProviders(data)
      } catch (error) {
        console.error('Failed to load providers:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProviders()
  }, [ids.join(',')])

  if (loading) {
    return (
      <section className="py-16 text-center">
        <Loader2Icon className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading providers...</p>
      </section>
    )
  }

  if (ids.length === 0) {
    return (
      <section className="py-16 text-center">
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          No providers to compare
        </h1>
        <p className="mt-2 text-muted-foreground">
          Add providers to your comparison list from the search results.
        </p>
        <Link
          href="/providers"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Browse therapists
        </Link>
      </section>
    )
  }

  if (providers.length === 0) {
    return (
      <section className="py-16 text-center">
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Providers not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          The providers you're trying to compare could not be found.
        </p>
        <Link
          href="/providers"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Browse therapists
        </Link>
      </section>
    )
  }

  return (
    <section className="py-8">
      <div className="container">
        <Link
          href="/providers"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Back to search
        </Link>

        <h1 className="font-heading text-3xl font-semibold text-foreground">
          Compare therapists
        </h1>
        <p className="mt-1 text-muted-foreground">
          Side-by-side comparison of {providers.length} therapist{providers.length !== 1 ? 's' : ''}
        </p>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 pr-4 text-left text-sm font-medium text-muted-foreground w-40">
                  Compare
                </th>
                {providers.map((provider) => {
                  const user = provider.user
                  const initials = user?.name
                    ?.split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase() || '??'

                  return (
                    <th key={provider.id} className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mist-sage/30 text-xl font-semibold text-deep-teal">
                          {initials}
                        </div>
                        <Link
                          href={`/providers/${provider.slug || provider.id}`}
                          className="text-sm font-medium text-foreground hover:underline"
                        >
                          {user?.name || 'Therapist'}
                        </Link>
                        <span className="text-xs text-muted-foreground">{provider.title}</span>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-4 pr-4 text-sm font-medium text-foreground">Session fee</td>
                {providers.map((provider) => (
                  <td key={provider.id} className="py-4 px-4 text-center text-sm text-muted-foreground">
                    {provider.sessionFee ? `RM${provider.sessionFee}` : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 pr-4 text-sm font-medium text-foreground">Session format</td>
                {providers.map((provider) => (
                  <td key={provider.id} className="py-4 px-4 text-center text-sm text-muted-foreground">
                    {provider.sessionFormats?.map((f: any) => f.format).join(', ') || '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 pr-4 text-sm font-medium text-foreground">Specialties</td>
                {providers.map((provider) => (
                  <td key={provider.id} className="py-4 px-4 text-center text-sm text-muted-foreground">
                    {provider.specialties?.map((s: any) => s.title).join(', ') || '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 pr-4 text-sm font-medium text-foreground">Location</td>
                {providers.map((provider) => (
                  <td key={provider.id} className="py-4 px-4 text-center text-sm text-muted-foreground">
                    {provider.sessionFormats?.find((f: any) => f.location)?.location || 'Online only'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 pr-4 text-sm font-medium text-foreground">Action</td>
                {providers.map((provider) => (
                  <td key={provider.id} className="py-4 px-4 text-center">
                    <Link
                      href={`/providers/${provider.slug || provider.id}/book`}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Book now
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
