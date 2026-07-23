import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SearchHero } from '@/heros/SearchHero'
import { BlobShape } from '@/components/ui/blob-shape'
import { ProviderCard } from '@/components/providers/ProviderCard'
import { MentorNote } from '@/components/ui/mentor-note'
import { ArrowRightIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kemudi — Find the Right Therapist for You',
  description:
    'A trusted navigation platform for mental health services in Malaysia. Compare therapists, read reviews, and book your first session.',
}

export default async function HomePage() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'provider-profiles',
    where: {
      approvalStatus: { equals: 'approved' },
    },
    limit: 6,
    depth: 2,
    sort: '-createdAt',
  })

  return (
    <main>
      <SearchHero
        searchPlaceholder="What brings you here today?"
        suggestions={[
          { label: 'Anxiety', url: '/providers?specialty=anxiety' },
          { label: 'Depression', url: '/providers?specialty=depression' },
          { label: 'Relationship issues', url: '/providers?specialty=relationships' },
          { label: 'Online therapy', url: '/providers?format=online' },
        ]}
        backgroundBlob="mistSage"
      />

      <section className="relative py-16 md:py-24">
        <BlobShape color="warm-sand" className="left-0 top-0 -translate-x-1/4 -translate-y-1/4" size={400} />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <MentorNote className="border-l-0 text-center text-xl md:text-2xl">
              Not sure where to start? That's okay. You're already here, and that's the hardest part.
            </MentorNote>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-deep-teal/10 text-deep-teal">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">Find your match</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Search by specialty, language, or approach. Filter by what matters to you — budget, location, or session format.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-mist-sage/30 text-deep-teal">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0116.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.665 6.023 6.023 0 01-2.77-.665" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">Compare side by side</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Add therapists to your shortlist and compare their profiles, approaches, and fees — all in one view.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-clay-rose/15 text-deep-teal">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">Book when ready</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                See real availability, pick a time that works, and book directly. No phone calls, no waiting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {result.docs.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
                  Therapists on Kemudi
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Verified professionals ready to support you.
                </p>
              </div>
              <Link
                href="/providers"
                className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:inline-flex"
              >
                View all <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {result.docs.map((provider: any) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link
                href="/providers"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all therapists <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-border py-16 md:py-24">
        <div className="container text-center">
          <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
            Take your time. We're here when you're ready.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Whether you're exploring for the first time or looking for a better fit, Kemudi helps you make confident choices about your care.
          </p>
          <Link
            href="/providers"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse therapists <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
