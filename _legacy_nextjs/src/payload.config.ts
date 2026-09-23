import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { migrations } from './migrations'

import { Bookings } from './collections/Bookings'
import { Categories } from './collections/Categories'
import { Languages } from './collections/Languages'
import { MatchResponses } from './collections/MatchResponses'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { ProviderProfiles } from './collections/ProviderProfiles'
import { Reviews } from './collections/Reviews'
import { Specialties } from './collections/Specialties'
import { Approaches } from './collections/Approaches'
import { Centres } from './collections/Centres'
import { Licences } from './collections/Licences'
import { Interests } from './collections/Interests'
import { ConsentLogs } from './collections/ConsentLogs'
import { SiteSettings } from './globals/SiteSettings'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { getRdsAuthToken } from './utilities/rdsAuth'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  // AWS Aurora Postgres (via Vercel's AWS Marketplace integration) speaks the
  // standard wire protocol, so plain postgresAdapter works for both dev and
  // prod — no Neon/Vercel-specific adapter needed. Aurora has no static
  // password (PGHOST set, no POSTGRES_URL) — auth is IAM via a per-connection
  // token (see ./utilities/rdsAuth). Falls back to POSTGRES_URL for plain
  // local Postgres (e.g. docker-compose) when PGHOST isn't set.
  db: postgresAdapter({
    prodMigrations: migrations,
    pool: process.env.PGHOST
      ? {
          host: process.env.PGHOST,
          port: Number(process.env.PGPORT) || 5432,
          database: process.env.PGDATABASE,
          user: process.env.PGUSER,
          password: getRdsAuthToken,
          ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
          max: 2,
          connectionTimeoutMillis: 10_000,
          idleTimeoutMillis: 5_000,
          keepAlive: true,
          allowExitOnIdle: true,
        }
      : {
          connectionString: process.env.POSTGRES_URL || '',
        },
    push: false,
  }),
  collections: [Pages, Posts, Media, Categories, Users, ProviderProfiles, Specialties, Approaches, Centres, Licences, Interests, ConsentLogs, Reviews, Languages, Bookings, MatchResponses],
  cors: [getServerSideURL()].filter(Boolean),
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Malay', code: 'ms' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins: [
    ...plugins,
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  globals: [Header, Footer, SiteSettings],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
