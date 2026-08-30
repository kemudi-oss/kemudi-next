'use client'

import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SearchIcon, ArrowRightIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { BlobShape } from '@/components/ui/blob-shape'

interface SearchHeroProps {
  richText?: any
  searchPlaceholder?: string
  suggestions?: Array<{ label: string; url: string }>
  backgroundBlob?: 'mistSage' | 'warmSand' | 'none'
}

export const SearchHero: React.FC<SearchHeroProps> = ({
  searchPlaceholder = 'What are you looking for?',
  suggestions = [],
  backgroundBlob = 'mistSage',
}) => {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (query.trim()) {
        router.push(`/providers?q=${encodeURIComponent(query.trim())}`)
      }
    },
    [query, router],
  )

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      {backgroundBlob !== 'none' && (
        <BlobShape
          color={backgroundBlob === 'mistSage' ? 'mist-sage' : 'warm-sand'}
          className="right-0 top-0 -translate-y-1/4 translate-x-1/4"
          size={500}
        />
      )}

      <div className="container relative z-10 mx-auto max-w-3xl text-center">
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Finding the right support shouldn&rsquo;t feel like another thing to figure out alone.
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">
          Search for therapists, compare profiles, and book your first session.
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="relative mx-auto max-w-xl">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-32 text-lg text-foreground shadow-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Search
            </button>
          </div>
        </form>

        {suggestions.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.label}
                onClick={() => router.push(suggestion.url)}
                className="group flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
              >
                {suggestion.label}
                <ArrowRightIcon className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
