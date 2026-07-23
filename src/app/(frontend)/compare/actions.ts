'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function getProvidersForComparison(ids: string[]) {
  if (ids.length === 0) return []
  if (ids.length > 4) return [] // Max 4 providers

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'provider-profiles',
    where: {
      and: [
        { id: { in: ids } },
        { approvalStatus: { equals: 'approved' } },
      ],
    },
    limit: 4,
    depth: 2,
  })

  return result.docs
}
