import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ProviderDetail } from '@/components/providers/ProviderDetail'

// Revalidate every hour (ISR)
export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'provider-profiles',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 3,
  })

  const provider = result.docs[0]

  if (!provider) return { title: 'Provider not found' }

  const user = typeof provider.user === 'object' && provider.user !== null ? provider.user : null

  return {
    title: `${user?.name || 'Therapist'} - ${provider.title} | Kemudi`,
    description: provider.meta?.description || `Book a session with ${user?.name || 'this therapist'}.`,
  }
}

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'provider-profiles',
    where: {
      and: [
        { slug: { equals: slug } },
        { approvalStatus: { equals: 'approved' } },
      ],
    },
    limit: 1,
    depth: 3,
  })

  const provider = result.docs[0]

  if (!provider) notFound()

  const user = typeof provider.user === 'object' && provider.user !== null ? provider.user : null

  const reviews = await payload.find({
    collection: 'reviews',
    where: {
      and: [
        { provider: { equals: provider.id } },
        { status: { equals: 'approved' } },
      ],
    },
    limit: 20,
    depth: 1,
  })

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: user?.name || 'Therapist',
    description: provider.meta?.description || `Book a session with ${user?.name || 'this therapist'}.`,
    url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://example.com'}/providers/${slug}`,
    priceRange: provider.sessionFee ? `RM${provider.sessionFee}` : undefined,
    address: provider.sessionFormats?.find((f: any) => f.location)?.location ? {
      '@type': 'PostalAddress',
      addressLocality: provider.sessionFormats.find((f: any) => f.location)?.location,
    } : undefined,
    medicalSpecialty: provider.specialties?.map((s: any) => s.title || s).filter(Boolean),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProviderDetail provider={provider} reviews={reviews.docs} />
    </>
  )
}
