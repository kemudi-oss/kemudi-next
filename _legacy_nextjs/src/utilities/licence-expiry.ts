'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Resend } from 'resend'
import { LicenceExpiryEmail } from '@/emails/LicenceExpiry'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function checkExpiringLicences() {
  const payload = await getPayload({ config })

  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  // Find licences expiring within 30 days
  const licences = await payload.find({
    collection: 'licenses',
    where: {
      expiryDate: {
        less_than_equal: thirtyDaysFromNow.toISOString(),
      },
    },
    depth: 2,
  })

  for (const licence of licences.docs) {
    const expiryDate = new Date(licence.expiryDate)
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    // Only send emails on specific intervals: 30, 7, or 1 day before expiry
    if (daysUntilExpiry === 30 || daysUntilExpiry === 7 || daysUntilExpiry === 1) {
      // Get provider info
      const provider = typeof licence.provider === 'object' ? licence.provider : null
      if (!provider) continue

      const user = typeof provider.user === 'object' ? provider.user : null
      if (!user?.email) continue

      // Send email
      await resend.emails.send({
        from: 'Kemudi <noreply@kemudi.com>',
        to: user.email,
        subject: `Licence expiry reminder: ${licence.type} expires in ${daysUntilExpiry} days`,
        react: LicenceExpiryEmail({
          providerName: user.name || 'Provider',
          licenceType: licence.type,
          expiryDate: expiryDate.toLocaleDateString('en-MY'),
          daysUntilExpiry,
        }) as React.ReactNode,
      })
    }
  }
}
