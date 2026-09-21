import { Signer } from '@aws-sdk/rds-signer'
import { awsCredentialsProvider } from '@vercel/functions/oidc'

/**
 * AWS Aurora (via Vercel's AWS Marketplace integration) has no static
 * password — auth is IAM: assume AWS_ROLE_ARN (via Vercel's OIDC
 * federation, works both on Vercel and locally through `vercel env pull`'s
 * VERCEL_OIDC_TOKEN) then generate a short-lived RDS auth token per
 * connection. Tokens expire in ~15min, so this must be called fresh for
 * every new pg connection, not cached at pool-creation time.
 */
let signer: Signer | undefined

function getSigner(): Signer {
  if (!signer) {
    signer = new Signer({
      hostname: process.env.PGHOST!,
      port: Number(process.env.PGPORT) || 5432,
      username: process.env.PGUSER!,
      region: process.env.AWS_REGION,
      credentials: process.env.AWS_ROLE_ARN
        ? awsCredentialsProvider({ roleArn: process.env.AWS_ROLE_ARN })
        : undefined,
    })
  }
  return signer
}

export function getRdsAuthToken(): Promise<string> {
  return getSigner().getAuthToken()
}
