'use client'

import React, { useState } from 'react'
import { useBooking } from '@/providers/BookingProvider'
import { cn } from '@/utilities/ui'
import { Loader2Icon, CreditCardIcon, CheckCircleIcon } from 'lucide-react'
import { sendBookingConfirmationEmail } from '@/app/(frontend)/booking/email-actions'

interface StepPaymentProps {
  onComplete?: () => void
}

export const StepPayment: React.FC<StepPaymentProps> = ({ onComplete }) => {
  const { setStep, sessionFee, serviceName, selectedDate, selectedTime, providerName, providerId, clientEmail, clientName, providerSlug } = useBooking()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>('card')
  const [emailSent, setEmailSent] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    setError(null)

    try {
      // Create payment intent
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: sessionFee || 0,
          currency: 'myr',
          providerId,
          bookingId: `booking-${Date.now()}`,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Payment failed')
      }

      // Send confirmation email
      if (clientEmail && clientName) {
        const emailResult = await sendBookingConfirmationEmail({
          clientEmail,
          clientName,
          providerName: providerName || 'Therapist',
          providerSlug: providerSlug || providerId || '',
          serviceName: serviceName || 'Therapy Session',
          date: selectedDate || '',
          time: selectedTime || '',
          sessionFee: sessionFee || 0,
        })

        if (emailResult.success) {
          setEmailSent(true)
        }
      }

      // Call onComplete callback
      onComplete?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-foreground">Payment</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Complete your booking with secure payment.
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">
          {error}
        </div>
      )}

      {emailSent && (
        <div className="mt-4 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success flex items-center gap-2">
          <CheckCircleIcon className="h-4 w-4" />
          Confirmation email sent to {clientEmail}
        </div>
      )}

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <CreditCardIcon className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Credit/Debit Card</p>
            <p className="text-xs text-muted-foreground">Powered by Stripe</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-muted/50 p-4">
        <h3 className="text-sm font-medium text-foreground">Order summary</h3>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p>{providerName}</p>
          <p>{serviceName}</p>
          <p>{selectedDate} at {selectedTime}</p>
        </div>
        <div className="mt-3 border-t border-border pt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Total</span>
            <span className="text-lg font-heading font-semibold text-foreground">RM{sessionFee}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep(3)}
          disabled={loading}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={loading || !paymentMethod}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay RM${sessionFee}`
          )}
        </button>
      </div>
    </div>
  )
}
