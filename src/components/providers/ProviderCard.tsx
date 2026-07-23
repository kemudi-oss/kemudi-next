'use client'

import React from 'react'
import Link from 'next/link'
import { StarIcon, MapPinIcon, VideoIcon, PlusIcon, CheckIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { useCompare } from '@/providers/CompareProvider'

interface ProviderCardProps {
  provider: {
    id: string
    slug?: string
    title: string
    user?: {
      name?: string
      avatar?: any
    }
    rating?: number
    reviewCount?: number
    sessionFee: number
    sessionFormats?: Array<{
      format: string
      location?: string
    }>
    specialties?: Array<{
      title: string
    }>
  }
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  const { add, remove, isInCompare } = useCompare()
  const inCompare = isInCompare(provider.id)

  const location = provider.sessionFormats?.find((f) => f.format === 'in-person' || f.format === 'both')
  const hasOnline = provider.sessionFormats?.some((f) => f.format === 'online' || f.format === 'both')

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inCompare) {
      remove(provider.id)
    } else {
      add({
        id: provider.id,
        name: provider.user?.name || '',
        title: provider.title,
        avatar: provider.user?.avatar?.url,
        rating: provider.rating || 0,
        sessionFee: provider.sessionFee,
      })
    }
  }

  return (
    <Link
      href={`/providers/${provider.slug || provider.id}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-elevated hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-mist-sage/30 text-lg font-semibold text-deep-teal">
          {provider.user?.avatar?.url ? (
            <img
              src={provider.user.avatar.url}
              alt={provider.user.name || ''}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            (provider.user?.name || '?').charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
            {provider.user?.name}
          </h3>
          <p className="text-sm text-muted-foreground">{provider.title}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {provider.rating != null && (
          <span className="flex items-center gap-1">
            <StarIcon className="h-3.5 w-3.5 fill-warning text-warning" />
            <span className="font-medium text-foreground">{provider.rating.toFixed(1)}</span>
            {provider.reviewCount != null && (
              <span>({provider.reviewCount})</span>
            )}
          </span>
        )}
        {location?.location && (
          <span className="flex items-center gap-1">
            <MapPinIcon className="h-3.5 w-3.5" />
            {location.location}
          </span>
        )}
        {hasOnline && (
          <span className="flex items-center gap-1">
            <VideoIcon className="h-3.5 w-3.5" />
            Online
          </span>
        )}
      </div>

      {provider.specialties && provider.specialties.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {provider.specialties.slice(0, 3).map((s, i) => (
            <span
              key={i}
              className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
            >
              {s.title}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm font-medium text-foreground">
          From RM{provider.sessionFee}/session
        </span>
        <button
          onClick={handleCompareToggle}
          className={cn(
            'flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
            inCompare
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
          )}
        >
          {inCompare ? (
            <>
              <CheckIcon className="h-3 w-3" /> Added
            </>
          ) : (
            <>
              <PlusIcon className="h-3 w-3" /> Compare
            </>
          )}
        </button>
      </div>
    </Link>
  )
}
