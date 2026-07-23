import { Resend } from 'resend'
import { BookingConfirmation } from '@/emails/BookingConfirmation'
import React from 'react'

const resend = new Resend(process.env.RESEND_API_KEY)

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
    const { data, error } = await resend.emails.send({
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
