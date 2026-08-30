'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { BookingProvider } from '@/providers/BookingProvider'
import { BookingProgress } from '@/components/booking/BookingProgress'
import { StepSelectService } from '@/components/booking/StepSelectService'
import { StepChooseTime } from '@/components/booking/StepChooseTime'
import { StepConfirmDetails } from '@/components/booking/StepConfirmDetails'
import { StepPayment } from '@/components/booking/StepPayment'
import { IntakeForm } from '@/components/booking/StepIntakeForm'
import { InductionCourse } from '@/components/booking/InductionCourse'
import { useBooking } from '@/providers/BookingProvider'
import { getProviderForBooking, getProviderAvailability } from './actions'
import { autoRegisterUser } from './auth-actions'
import { useLocale } from '@/providers/LocaleProvider'
import { Loader2Icon } from 'lucide-react'

function BookingFlow() {
  const { step, intakeRequired, setIntakeRequired, clientEmail, clientName } = useBooking()
  const { locale } = useLocale()
  const searchParams = useSearchParams()
  const slug = searchParams.get('provider') || ''
  const [provider, setProvider] = useState<any>(null)
  const [availability, setAvailability] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showInduction, setShowInduction] = useState(false)

  // Auto-register user when reaching payment step
  useEffect(() => {
    if (step === 4 && clientEmail && clientName && !showInduction) {
      autoRegisterUser(clientEmail, clientName, locale).catch(console.error)
    }
  }, [step, clientEmail, clientName, showInduction, locale])

  useEffect(() => {
    async function loadProvider() {
      if (!slug) {
        setError('No provider specified')
        setLoading(false)
        return
      }

      try {
        const [providerData, availabilityData] = await Promise.all([
          getProviderForBooking(slug),
          getProviderAvailability(slug),
        ])

        if (!providerData) {
          setError('Provider not found')
          setLoading(false)
          return
        }

        setProvider(providerData)
        setAvailability(availabilityData)
        setIntakeRequired(providerData.intakeFormRequired || false)
      } catch (err) {
        setError('Failed to load provider')
      } finally {
        setLoading(false)
      }
    }

    loadProvider()
  }, [slug, setIntakeRequired])

  if (loading) {
    return (
      <section className="py-8">
        <div className="container mx-auto max-w-2xl text-center">
          <Loader2Icon className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading provider...</p>
        </div>
      </section>
    )
  }

  if (error || !provider) {
    return (
      <section className="py-8">
        <div className="container mx-auto max-w-2xl text-center">
          <h1 className="font-heading text-2xl font-semibold text-foreground">Error</h1>
          <p className="mt-2 text-muted-foreground">{error || 'Provider not found'}</p>
        </div>
      </section>
    )
  }

  // Show induction course after booking is confirmed
  if (showInduction) {
    return (
      <InductionCourse
        providerName={provider.user?.name}
        onComplete={() => {
          // Induction completed - booking is fully done
        }}
      />
    )
  }

  return (
    <section className="py-8">
      <div className="container mx-auto max-w-2xl">
        <h1 className="mb-6 text-center font-heading text-2xl font-semibold text-foreground">
          Book a session with {provider.user?.name || 'Therapist'}
        </h1>

        <BookingProgress />

        <div className="mt-8">
          {step === 1 && <StepSelectService provider={provider} />}
          {step === 2 && <StepChooseTime provider={provider} availability={availability} />}
          {step === 3 && <StepConfirmDetails provider={provider} />}
          {step === 4 && (
            <StepPayment
              onComplete={() => {
                if (intakeRequired) {
                  // Move to intake form (step 5)
                } else {
                  // No intake required - show induction
                  setShowInduction(true)
                }
              }}
            />
          )}
          {step === 5 && intakeRequired && (
            <IntakeForm
              providerId={provider.id}
              onComplete={() => {
                // Intake completed - show induction
                setShowInduction(true)
              }}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default function BookingPage() {
  return (
    <BookingProvider>
      <BookingFlow />
    </BookingProvider>
  )
}
