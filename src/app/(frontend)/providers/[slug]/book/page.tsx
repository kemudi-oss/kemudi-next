import { redirect, notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function ProviderBookPage({
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
  })

  const provider = result.docs[0]

  if (!provider) notFound()

  redirect(`/booking?provider=${provider.id}`)
}
