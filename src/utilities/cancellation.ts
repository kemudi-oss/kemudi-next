'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import Stripe from 'stripe'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-06-24.dahlia',
  })
}

interface CancelBookingProps {
  bookingId: string
  cancelledBy: 'user' | 'provider' | 'admin'
  reason?: string
}

export async function cancelBooking({ bookingId, cancelledBy, reason }: CancelBookingProps) {
  const payload = await getPayload({ config })

  // Get the booking
  const booking = await payload.findByID({
    collection: 'bookings',
    id: bookingId,
    depth: 2,
  })

  if (!booking) {
    return { success: false, error: 'Booking not found' }
  }

  // Update booking status
  await payload.update({
    collection: 'bookings',
    id: bookingId,
    data: {
      bookingStatus: 'cancelled',
    },
  })

  return { success: true }
}

interface RequestRescheduleProps {
  bookingId: string
  providerId: string
  message?: string
}

export async function requestReschedule({ bookingId, providerId, message }: RequestRescheduleProps) {
  const payload = await getPayload({ config })

  // In production, send email notification to client
  // For now, just log the request
  console.log('Reschedule requested for booking:', bookingId, 'by provider:', providerId)

  return { success: true }
}
