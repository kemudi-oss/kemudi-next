import { getServerSideSitemap, type ISitemapField } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getProvidersSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'provider-profiles',
      where: { approvalStatus: { equals: 'approved' } },
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
    })

    return results.docs.map((provider: any): ISitemapField => ({
      loc: `${SITE_URL}/providers/${provider.slug || provider.id}`,
      lastmod: provider.updatedAt,
      changefreq: 'weekly' as const,
      priority: 0.7,
    }))
  },
  ['providers-sitemap'],
  { revalidate: 3600 },
)

export async function GET() {
  const sitemap = await getProvidersSitemap()
  return getServerSideSitemap(sitemap)
}
