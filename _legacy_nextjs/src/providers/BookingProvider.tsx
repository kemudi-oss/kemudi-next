'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'

interface BookingState {
  step: 1 | 2 | 3 | 4 | 5
  providerId: string | null
  providerName: string | null
  providerSlug: string | null
  serviceId: string | null
  serviceName: string | null
  sessionFee: number | null
  selectedDate: string | null
  selectedTime: string | null
  clientName: string
  clientEmail: string
  clientPhone: string
  clientNotes: string
  paymentMethod: string | null
  intakeRequired: boolean
}

interface BookingContextType extends BookingState {
  setStep: (step: 1 | 2 | 3 | 4 | 5) => void
  setProvider: (id: string, name: string, fee: number, slug?: string) => void
  setService: (id: string, name: string) => void
  setDateTime: (date: string, time: string) => void
  setClientDetails: (details: Partial<Pick<BookingState, 'clientName' | 'clientEmail' | 'clientPhone' | 'clientNotes'>>) => void
  setPaymentMethod: (method: string) => void
  setIntakeRequired: (required: boolean) => void
  reset: () => void
}

const BookingContext = createContext<BookingContextType | null>(null)

const initialState: BookingState = {
  step: 1,
  providerId: null,
  providerName: null,
  providerSlug: null,
  serviceId: null,
  serviceName: null,
  sessionFee: null,
  selectedDate: null,
  selectedTime: null,
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  clientNotes: '',
  paymentMethod: null,
  intakeRequired: false,
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BookingState>(initialState)

  const setStep = useCallback((step: 1 | 2 | 3 | 4 | 5) => {
    setState((prev) => ({ ...prev, step }))
  }, [])

  const setProvider = useCallback((id: string, name: string, fee: number, slug?: string) => {
    setState((prev) => ({ ...prev, providerId: id, providerName: name, sessionFee: fee, providerSlug: slug || id }))
  }, [])

  const setService = useCallback((id: string, name: string) => {
    setState((prev) => ({ ...prev, serviceId: id, serviceName: name }))
  }, [])

  const setDateTime = useCallback((date: string, time: string) => {
    setState((prev) => ({ ...prev, selectedDate: date, selectedTime: time }))
  }, [])

  const setClientDetails = useCallback((details: Partial<Pick<BookingState, 'clientName' | 'clientEmail' | 'clientPhone' | 'clientNotes'>>) => {
    setState((prev) => ({ ...prev, ...details }))
  }, [])

  const setPaymentMethod = useCallback((method: string) => {
    setState((prev) => ({ ...prev, paymentMethod: method }))
  }, [])

  const setIntakeRequired = useCallback((required: boolean) => {
    setState((prev) => ({ ...prev, intakeRequired: required }))
  }, [])

  const reset = useCallback(() => setState(initialState), [])

  return (
    <BookingContext.Provider
      value={{ ...state, setStep, setProvider, setService, setDateTime, setClientDetails, setPaymentMethod, setIntakeRequired, reset }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}
