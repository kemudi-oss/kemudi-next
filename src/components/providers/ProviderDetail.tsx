'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  StarIcon,
  MapPinIcon,
  VideoIcon,
  CalendarIcon,
  ChevronDownIcon,
  ArrowLeftIcon,
} from 'lucide-react'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { MentorNote } from '@/components/ui/mentor-note'

interface ProviderDetailProps {
  provider: any
  reviews: any[]
}

type Tab = 'about' | 'services' | 'reviews' | 'faq'

export const ProviderDetail: React.FC<ProviderDetailProps> = ({ provider, reviews }) => {
  const [activeTab, setActiveTab] = useState<Tab>('about')

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length
      : 0

  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r: any) => r.rating === stars).length,
  }))

  const location = provider.sessionFormats?.find(
    (f: any) => f.format === 'in-person' || f.format === 'both',
  )
  const hasOnline = provider.sessionFormats?.some(
    (f: any) => f.format === 'online' || f.format === 'both',
  )

  return (
    <section className="py-8">
      <div className="container max-w-4xl">
        <Link
          href="/providers"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Back to search
        </Link>

        {/* Header */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-mist-sage/30 text-2xl font-semibold text-deep-teal">
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

            <div className="flex-1">
              <h1 className="font-heading text-2xl font-semibold text-foreground">
                {provider.user?.name}
              </h1>
              <p className="text-muted-foreground">{provider.title}</p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {avgRating > 0 && (
                  <span className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-medium text-foreground">{avgRating.toFixed(1)}</span>
                    <span>({reviews.length} reviews)</span>
                  </span>
                )}
                {location?.location && (
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" />
                    {location.location}
                  </span>
                )}
                {hasOnline && (
                  <span className="flex items-center gap-1">
                    <VideoIcon className="h-4 w-4" />
                    Online sessions
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`/booking?provider=${provider.id}`}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <CalendarIcon className="h-4 w-4" />
                  Book a session
                </Link>
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-heading font-semibold text-foreground">
                RM{provider.sessionFee}
              </p>
              <p className="text-sm text-muted-foreground">per session</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b border-border">
          <nav className="flex gap-6">
            {(['about', 'services', 'reviews', 'faq'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'border-b-2 pb-3 text-sm font-medium transition-colors capitalize',
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {tab}
                {tab === 'reviews' && reviews.length > 0 && (
                  <span className="ml-1.5 text-xs text-muted-foreground">({reviews.length})</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'about' && (
            <div>
              {provider.about && <RichText data={provider.about} />}
              {provider.philosophy && (
                <MentorNote>
                  {provider.philosophy.root?.children?.[0]?.children?.[0]?.text ||
                    'My approach to therapy'}
                </MentorNote>
              )}
              {provider.credentials && provider.credentials.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    Credentials
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {provider.credentials.map((c: any, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{c.name}</span>
                        {c.institution && <span> — {c.institution}</span>}
                        {c.year && <span> ({c.year})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {provider.approaches && provider.approaches.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    Therapeutic approaches
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {provider.approaches.map((a: any, i: number) => (
                      <span
                        key={i}
                        className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                      >
                        {a.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-heading font-semibold text-foreground">
                    Individual Therapy
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    One-on-one sessions tailored to your needs.
                  </p>
                  <p className="mt-4 text-lg font-semibold text-foreground">
                    RM{provider.sessionFee}
                    <span className="text-sm font-normal text-muted-foreground">/session</span>
                  </p>
                  <Link
                    href={`/booking?provider=${provider.id}`}
                    className="mt-4 block rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Book now
                  </Link>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-foreground">Session formats</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {provider.sessionFormats?.map((f: any, i: number) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                    >
                      {f.format === 'online' || f.format === 'both' ? (
                        <VideoIcon className="h-3 w-3" />
                      ) : (
                        <MapPinIcon className="h-3 w-3" />
                      )}
                      {f.format === 'both' ? 'Online & In-person' : f.format}
                      {f.location && ` — ${f.location}`}
                    </span>
                  ))}
                </div>
              </div>

              {(provider.acceptsInsurance || provider.offersSlidingScale) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {provider.acceptsInsurance && (
                    <span className="rounded-full bg-success/10 px-3 py-1 text-sm text-success">
                      Accepts insurance
                    </span>
                  )}
                  {provider.offersSlidingScale && (
                    <span className="rounded-full bg-clay-rose/10 px-3 py-1 text-sm text-clay-rose">
                      Sliding scale available
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {reviews.length > 0 && (
                <div className="mb-8 flex items-center gap-6 rounded-xl border border-border bg-card p-5">
                  <div className="text-center">
                    <p className="text-4xl font-heading font-semibold text-foreground">
                      {avgRating.toFixed(1)}
                    </p>
                    <div className="mt-1 flex justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarIcon
                          key={s}
                          className={cn(
                            'h-4 w-4',
                            s <= Math.round(avgRating)
                              ? 'fill-warning text-warning'
                              : 'text-muted',
                          )}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex-1 space-y-1">
                    {ratingBreakdown.map((r) => (
                      <div key={r.stars} className="flex items-center gap-2 text-sm">
                        <span className="w-3 text-muted-foreground">{r.stars}</span>
                        <div className="flex-1 overflow-hidden rounded-full bg-muted h-2">
                          <div
                            className="h-full rounded-full bg-warning"
                            style={{
                              width:
                                reviews.length > 0
                                  ? `${(r.count / reviews.length) * 100}%`
                                  : '0%',
                            }}
                          />
                        </div>
                        <span className="w-6 text-right text-xs text-muted-foreground">
                          {r.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    No reviews yet. Be the first to share your experience.
                  </p>
                ) : (
                  reviews.map((review: any) => (
                    <div
                      key={review.id}
                      className="rounded-xl border border-border bg-card p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">
                            {review.authorName || 'Anonymous'}
                          </p>
                          {review.authorAge && (
                            <p className="text-xs text-muted-foreground">{review.authorAge}</p>
                          )}
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <StarIcon
                              key={s}
                              className={cn(
                                'h-3.5 w-3.5',
                                s <= (review.rating || 0)
                                  ? 'fill-warning text-warning'
                                  : 'text-muted',
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      {review.title && (
                        <p className="mt-2 font-medium text-foreground">{review.title}</p>
                      )}
                      {review.content && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <RichText data={review.content} />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div>
              {provider.faq && provider.faq.length > 0 ? (
                <div className="divide-y divide-border rounded-xl border border-border">
                  {provider.faq.map((item: any, i: number) => (
                    <details key={i} className="group">
                      <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-foreground">
                        {item.question}
                        <ChevronDownIcon className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="px-5 pb-4 text-sm text-muted-foreground">
                        <RichText data={item.answer} />
                      </div>
                    </details>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-muted-foreground">
                  No frequently asked questions yet.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
