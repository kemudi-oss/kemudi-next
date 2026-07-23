'use client'

import React from 'react'
import { useBooking } from '@/providers/BookingProvider'
import { cn } from '@/utilities/ui'
import { CheckIcon } from 'lucide-react'

const steps = [
  { number: 1, label: 'Service' },
  { number: 2, label: 'Time' },
  { number: 3, label: 'Details' },
  { number: 4, label: 'Payment' },
]

export const BookingProgress: React.FC = () => {
  const { step } = useBooking()

  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((s, i) => (
        <React.Fragment key={s.number}>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                step > s.number
                  ? 'bg-primary text-primary-foreground'
                  : step === s.number
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
              )}
            >
              {step > s.number ? <CheckIcon className="h-4 w-4" /> : s.number}
            </div>
            <span
              className={cn(
                'text-sm font-medium hidden sm:inline',
                step >= s.number ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                'h-0.5 w-8 sm:w-12',
                step > s.number ? 'bg-primary' : 'bg-muted',
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
