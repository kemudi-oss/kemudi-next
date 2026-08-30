'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function getProviderForBooking(slug: string) {
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

  return result.docs[0] || null
}

export async function getProviderAvailability(providerId: string) {
  const payload = await getPayload({ config })

  // Get existing published bookings for this provider
  const bookings = await payload.find({
    collection: 'bookings',
    where: {
      and: [
        { provider: { equals: providerId } },
        { status: { in: ['pending', 'confirmed'] } },
      ],
    },
    limit: 100,
    depth: 0,
  })

  return bookings.docs.map((booking: any) => ({
    date: booking.datetime,
    status: booking.status,
  }))
}
