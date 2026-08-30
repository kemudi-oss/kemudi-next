'use server'

import { sendBookingConfirmation } from '@/utilities/email'

interface SendConfirmationProps {
  clientEmail: string
  clientName: string
  providerName: string
  providerSlug: string
  serviceName: string
  date: string
  time: string
  sessionFee: number
}

export async function sendBookingConfirmationEmail({
  clientEmail,
  clientName,
  providerName,
  providerSlug,
  serviceName,
  date,
  time,
  sessionFee,
}: SendConfirmationProps) {
  return sendBookingConfirmation({
    to: clientEmail,
    clientName,
    providerName,
    serviceName,
    date,
    time,
    sessionFee,
    providerProfileUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/providers/${providerSlug}`,
  })
}
