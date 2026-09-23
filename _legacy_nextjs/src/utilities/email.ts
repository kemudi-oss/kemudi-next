import { Resend } from 'resend'
import { BookingConfirmation } from '@/emails/BookingConfirmation'
import { ProviderApproval } from '@/emails/ProviderApproval'
import { ReviewNotification } from '@/emails/ReviewNotification'
import { generateICS } from '@/utilities/ics'
import React from 'react'

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

interface SendBookingConfirmationProps {
  to: string
  clientName: string
  providerName: string
  serviceName: string
  date: string
  time: string
  sessionFee: number
  providerProfileUrl: string
}

export async function sendBookingConfirmation({
  to,
  clientName,
  providerName,
  serviceName,
  date,
  time,
  sessionFee,
  providerProfileUrl,
}: SendBookingConfirmationProps) {
  try {
    const icsContent = generateICS({
      providerName,
      clientName,
      serviceName,
      date,
      time,
    })

    const { data, error } = await getResend().emails.send({
      from: 'Kemudi <noreply@kemudi.com>',
      to,
      subject: `Booking confirmed with ${providerName}`,
      react: BookingConfirmation({
        clientName,
        providerName,
        serviceName,
        date,
        time,
        sessionFee,
        providerProfileUrl,
      }) as React.ReactNode,
      attachments: [
        {
          filename: 'booking.ics',
          content: Buffer.from(icsContent).toString('base64'),
        },
      ],
    })

    if (error) {
      console.error('Email error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

interface SendProviderApprovalProps {
  to: string
  providerName: string
  approved: boolean
  notes?: string
}

export async function sendProviderApprovalEmail({
  to,
  providerName,
  approved,
  notes,
}: SendProviderApprovalProps) {
  try {
    const { data, error } = await getResend().emails.send({
      from: 'Kemudi <noreply@kemudi.com>',
      to,
      subject: approved
        ? 'Your Kemudi profile has been approved'
        : 'Kemudi profile review update',
      react: ProviderApproval({
        providerName,
        approved,
        notes,
      }) as React.ReactNode,
    })

    if (error) {
      console.error('Provider approval email error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Provider approval email error:', error)
    return { success: false, error }
  }
}

interface SendReviewNotificationProps {
  to: string
  providerName: string
  reviewerName: string
  rating: number
  reviewTitle?: string
}

export async function sendReviewNotificationEmail({
  to,
  providerName,
  reviewerName,
  rating,
  reviewTitle,
}: SendReviewNotificationProps) {
  try {
    const { data, error } = await getResend().emails.send({
      from: 'Kemudi <noreply@kemudi.com>',
      to,
      subject: `New review from ${reviewerName} on Kemudi`,
      react: ReviewNotification({
        providerName,
        reviewerName,
        rating,
        reviewTitle,
      }) as React.ReactNode,
    })

    if (error) {
      console.error('Review notification email error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Review notification email error:', error)
    return { success: false, error }
  }
}
