import React from 'react'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ProvidersListPage } from './page.client'

// Revalidate every hour (ISR)
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Find a Therapist | Kemudi',
  description:
    'Search for therapists and counsellors in Malaysia. Compare profiles, read reviews, and book your first session.',
}

export default async function ProvidersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const payload = await getPayload({ config })

  const query = typeof params.q === 'string' ? params.q : ''
  const specialty = typeof params.specialty === 'string' ? params.specialty : ''
  const language = typeof params.language === 'string' ? params.language : ''
  const format = typeof params.format === 'string' ? params.format : ''
  const maxPrice = typeof params.maxPrice === 'string' ? Number(params.maxPrice) : undefined
  const page = typeof params.page === 'string' ? Number(params.page) : 1
  const limit = 12

  const where: any = { approvalStatus: { equals: 'approved' } }

  if (query) {
    where.or = [
      { title: { contains: query } },
      { 'user.name': { contains: query } },
    ]
  }

  if (specialty) {
    where.specialties = { contains: specialty }
  }

  if (language) {
    where.languages = { contains: language }
  }

  if (format) {
    where['sessionFormats.format'] = { equals: format }
  }

  if (maxPrice && maxPrice < 500) {
    where.sessionFee = { less_than_equal: maxPrice }
  }

  const result = await payload.find({
    collection: 'provider-profiles',
    where,
    limit,
    page,
    depth: 2,
  })

  const services = await payload.find({
    collection: 'specialties',
    limit: 50,
  })

  const languages = await payload.find({
    collection: 'languages',
    limit: 20,
  })

  return (
    <ProvidersListPage
      providers={result.docs}
      totalPages={result.totalPages}
      currentPage={result.page || 1}
      services={services.docs}
      languages={languages.docs}
      query={query}
      initialFilters={{ specialty, language, format, maxPrice }}
    />
  )
}
