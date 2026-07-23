import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'
import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  // Search posts
  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              { title: { like: query } },
              { 'meta.description': { like: query } },
              { 'meta.title': { like: query } },
              { slug: { like: query } },
            ],
          },
        }
      : {}),
  })

  // Search providers
  const providers = await payload.find({
    collection: 'provider-profiles',
    where: {
      and: [
        { approvalStatus: { equals: 'approved' } },
        query
          ? {
              or: [
                { title: { like: query } },
                { 'user.name': { like: query } },
              ],
            }
          : {},
      ],
    },
    limit: 6,
    depth: 2,
  })

  // Search specialties
  const specialties = await payload.find({
    collection: 'specialties',
    where: query ? { title: { like: query } } : {},
    limit: 6,
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {query && providers.docs.length > 0 && (
        <div className="container mb-12">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Therapists</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {providers.docs.map((provider: any) => {
              const user = typeof provider.user === 'object' ? provider.user : null
              const initials = user?.name
                ?.split(' ')
                .map((n: string) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || '??'

              return (
                <Link
                  key={provider.id}
                  href={`/providers/${provider.slug || provider.id}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-elevated"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mist-sage/30 text-sm font-semibold text-deep-teal">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-medium text-foreground truncate">{user?.name || 'Therapist'}</h3>
                    <p className="text-xs text-muted-foreground truncate">{provider.title}</p>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link>
              )
            })}
          </div>
          {providers.totalDocs > 6 && (
            <Link href={`/providers?q=${encodeURIComponent(query)}`} className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
              View all {providers.totalDocs} therapists <ArrowRightIcon className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}

      {query && specialties.docs.length > 0 && (
        <div className="container mb-12">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Specialties</h2>
          <div className="flex flex-wrap gap-2">
            {specialties.docs.map((specialty: any) => (
              <Link
                key={specialty.id}
                href={`/providers?specialty=${specialty.slug || specialty.id}`}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground hover:border-primary/30 hover:text-primary transition-colors"
              >
                {specialty.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {posts.totalDocs > 0 && (
        <div className="container">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Articles</h2>
          <CollectionArchive posts={posts.docs as CardPostData[]} />
        </div>
      )}

      {query && providers.totalDocs === 0 && specialties.totalDocs === 0 && posts.totalDocs === 0 && (
        <div className="container text-center">
          <p className="text-muted-foreground">No results found for "{query}".</p>
        </div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Search | Kemudi',
  }
}
