'use client'

import React from 'react'
import { useBooking } from '@/providers/BookingProvider'

interface StepConfirmDetailsProps {
  provider: any
}

export const StepConfirmDetails: React.FC<StepConfirmDetailsProps> = ({ provider }) => {
  const {
    setStep, clientName, clientEmail, clientPhone, clientNotes,
    setClientDetails, serviceName, selectedDate, selectedTime, sessionFee,
  } = useBooking()

  const isValid = clientName && clientEmail

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-foreground">Confirm your details</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        We&rsquo;ll send your booking confirmation to this email.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground">Full name</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientDetails({ clientName: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            value={clientEmail}
            onChange={(e) => setClientDetails({ clientEmail: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">Phone (optional)</label>
          <input
            type="tel"
            value={clientPhone}
            onChange={(e) => setClientDetails({ clientPhone: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="+60 12 345 6789"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">Notes for your therapist (optional)</label>
          <textarea
            value={clientNotes}
            onChange={(e) => setClientDetails({ clientNotes: e.target.value })}
            rows={3}
            className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Anything you'd like your therapist to know before the session..."
          />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-muted/50 p-4">
        <h3 className="text-sm font-medium text-foreground">Booking summary</h3>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p>Provider: {provider.user?.name}</p>
          <p>Service: {serviceName}</p>
          <p>Date: {selectedDate}</p>
          <p>Time: {selectedTime}</p>
          <p className="font-medium text-foreground">Total: RM{sessionFee}</p>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep(2)}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          Back
        </button>
        <button
          onClick={() => setStep(4)}
          disabled={!isValid}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue to payment
        </button>
      </div>
    </div>
  )
}
