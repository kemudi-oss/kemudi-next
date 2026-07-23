'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SlidersHorizontalIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { ProviderCard } from '@/components/providers/ProviderCard'
import { FilterSidebar } from '@/components/providers/FilterSidebar'
import { CompareBar } from '@/components/providers/CompareBar'
import { CompareProvider } from '@/providers/CompareProvider'

interface ProvidersListPageProps {
  providers: any[]
  totalPages: number
  currentPage: number
  services: any[]
  languages: any[]
  query: string
  initialFilters: {
    specialty?: string
    language?: string
    format?: string
    maxPrice?: number
  }
}

export const ProvidersListPage: React.FC<ProvidersListPageProps> = ({
  providers,
  totalPages,
  currentPage,
  services,
  languages,
  query,
  initialFilters,
}) => {
  const [filters, setFilters] = useState(initialFilters)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const router = useRouter()

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (newFilters.specialty) params.set('specialty', newFilters.specialty)
    if (newFilters.language) params.set('language', newFilters.language)
    if (newFilters.format) params.set('format', newFilters.format)
    router.push(`/providers?${params.toString()}`)
  }

  return (
    <CompareProvider>
      <section className="py-8">
        <div className="container">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-semibold text-foreground">
                {query ? `Results for "${query}"` : 'Find a therapist'}
              </h1>
              <p className="mt-1 text-muted-foreground">
                {providers.length} therapist{providers.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground lg:hidden"
            >
              <SlidersHorizontalIcon className="h-4 w-4" />
              Filters
            </button>
          </div>

          <div className="mt-8 flex gap-8">
            {/* Desktop sidebar */}
            <FilterSidebar
              filters={{
                specialties: services.map((s) => ({ id: s.slug || s.id, title: s.title })),
                languages: languages.map((l) => ({ id: l.id, name: l.name })),
              }}
              selected={filters}
              onChange={handleFilterChange}
              className="hidden w-64 shrink-0 lg:block"
            />

            {/* Mobile filter drawer */}
            {mobileFiltersOpen && (
              <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm lg:hidden">
                <div className="absolute inset-y-0 left-0 w-80 overflow-y-auto bg-background p-6 shadow-elevated">
                  <FilterSidebar
                    filters={{
                      specialties: services.map((s) => ({ id: s.slug || s.id, title: s.title })),
                      languages: languages.map((l) => ({ id: l.id, name: l.name })),
                    }}
                    selected={filters}
                    onChange={(f) => {
                      handleFilterChange(f)
                      setMobileFiltersOpen(false)
                    }}
                  />
                </div>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="absolute inset-0"
                  aria-label="Close filters"
                />
              </div>
            )}

            {/* Results grid */}
            <div className="flex-1">
              {providers.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
                  <p className="text-lg font-medium text-foreground">No therapists found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={() => handleFilterChange({})}
                    className="mt-4 text-sm font-medium text-primary hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {providers.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/providers?page=${p}`}
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                        p === currentPage
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      {p}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <CompareBar />
    </CompareProvider>
  )
}
