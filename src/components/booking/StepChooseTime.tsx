'use client'

import React, { useState } from 'react'
import { useBooking } from '@/providers/BookingProvider'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface StepChooseTimeProps {
  provider: any
  availability: Array<{ date: string; status: string }>
}

export const StepChooseTime: React.FC<StepChooseTimeProps> = ({ provider, availability }) => {
  const { setDateTime, setStep, selectedDate, selectedTime } = useBooking()
  const [currentMonth] = useState(new Date())

  // Generate time slots from provider's session formats or use defaults
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '2:00 PM', '3:00 PM', '4:00 PM',
  ]

  // Check if a date+time slot is already booked
  const isSlotBooked = (date: string, time: string) => {
    return availability.some((slot) => {
      const slotDate = new Date(slot.date)
      const slotDateStr = `${slotDate.getFullYear()}-${String(slotDate.getMonth() + 1).padStart(2, '0')}-${String(slotDate.getDate()).padStart(2, '0')}`
      const slotTime = slotDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      return slotDateStr === date && slotTime === time && slot.status !== 'cancelled'
    })
  }

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate()

  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-foreground">Choose a date & time</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Select your preferred appointment slot.
      </p>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-medium text-foreground">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex gap-1">
            <button className="rounded p-1 text-muted-foreground hover:bg-muted">
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button className="rounded p-1 text-muted-foreground hover:bg-muted">
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d} className="py-1 font-medium">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isPast = new Date(dateStr) < new Date(new Date().toDateString())
            const isSelected = selectedDate === dateStr

            return (
              <button
                key={day}
                disabled={isPast}
                onClick={() => setDateTime(dateStr, selectedTime || '')}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors',
                  isPast && 'cursor-not-allowed text-muted-foreground/30',
                  isSelected && 'bg-primary text-primary-foreground',
                  !isSelected && !isPast && 'hover:bg-muted text-foreground',
                )}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-foreground">Available times</h3>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {timeSlots.map((time) => {
              const booked = isSlotBooked(selectedDate, time)
              return (
                <button
                  key={time}
                  disabled={booked}
                  onClick={() => setDateTime(selectedDate, time)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-sm transition-colors',
                    booked && 'cursor-not-allowed border-border text-muted-foreground/30',
                    selectedTime === time && !booked
                      ? 'border-primary bg-primary/5 text-primary'
                      : !booked && 'border-border text-muted-foreground hover:border-primary/30',
                  )}
                >
                  {time}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!selectedDate || !selectedTime}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
