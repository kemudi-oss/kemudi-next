'use client'

import React from 'react'
import { useBooking } from '@/providers/BookingProvider'
import { cn } from '@/utilities/ui'

interface StepSelectServiceProps {
  provider: any
}

export const StepSelectService: React.FC<StepSelectServiceProps> = ({ provider }) => {
  const { setService, setStep, serviceId } = useBooking()

  // Use provider's specialties as services
  const services = provider.specialties?.map((specialty: any) => ({
    id: specialty.id || specialty.slug || specialty,
    name: specialty.title || specialty.name || String(specialty),
    description: `Professional ${specialty.title || specialty.name || 'therapy'} services.`,
  })) || [
    { id: 'general', name: 'General Therapy', description: 'Professional therapy services.' },
  ]

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-foreground">Select a service</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose the type of session you'd like to book.
      </p>

      <div className="mt-6 space-y-3">
        {services.map((service: any) => (
          <button
            key={service.id}
            onClick={() => {
              setService(service.id, service.name)
              setStep(2)
            }}
            className={cn(
              'w-full rounded-xl border p-5 text-left transition-all',
              serviceId === service.id
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border bg-card hover:border-primary/30 hover:shadow-card',
            )}
          >
            <h3 className="font-heading font-medium text-foreground">{service.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
            <p className="mt-3 text-sm font-medium text-primary">
              RM{provider.sessionFee}/session
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
