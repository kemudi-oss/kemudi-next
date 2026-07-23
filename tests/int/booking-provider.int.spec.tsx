import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import React from 'react'
import { BookingProvider, useBooking } from '@/providers/BookingProvider'

// Test component that uses the booking context
function TestComponent() {
  const { step, setStep, providerId, setProvider, serviceId, setService } = useBooking()

  return (
    <div>
      <span data-testid="step">{step}</span>
      <span data-testid="providerId">{providerId || 'none'}</span>
      <span data-testid="serviceId">{serviceId || 'none'}</span>
      <button onClick={() => setStep(2)}>Next</button>
      <button onClick={() => setProvider('123', 'Dr. Test', 150)}>Set Provider</button>
      <button onClick={() => setService('individual', 'Individual Therapy')}>Set Service</button>
    </div>
  )
}

describe('BookingProvider', () => {
  it('provides initial state', () => {
    render(
      <BookingProvider>
        <TestComponent />
      </BookingProvider>
    )

    expect(screen.getByTestId('step')).toHaveTextContent('1')
    expect(screen.getByTestId('providerId')).toHaveTextContent('none')
    expect(screen.getByTestId('serviceId')).toHaveTextContent('none')
  })

  it('updates step when setStep is called', async () => {
    render(
      <BookingProvider>
        <TestComponent />
      </BookingProvider>
    )

    expect(screen.getByTestId('step')).toHaveTextContent('1')
    await act(async () => {
      screen.getByText('Next').click()
    })
    expect(screen.getByTestId('step')).toHaveTextContent('2')
  })

  it('updates provider when setProvider is called', async () => {
    render(
      <BookingProvider>
        <TestComponent />
      </BookingProvider>
    )

    expect(screen.getByTestId('providerId')).toHaveTextContent('none')
    await act(async () => {
      screen.getByText('Set Provider').click()
    })
    expect(screen.getByTestId('providerId')).toHaveTextContent('123')
  })

  it('updates service when setService is called', async () => {
    render(
      <BookingProvider>
        <TestComponent />
      </BookingProvider>
    )

    expect(screen.getByTestId('serviceId')).toHaveTextContent('none')
    await act(async () => {
      screen.getByText('Set Service').click()
    })
    expect(screen.getByTestId('serviceId')).toHaveTextContent('individual')
  })

  it('throws error when useBooking is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    function BadComponent() {
      useBooking()
      return null
    }

    expect(() => render(<BadComponent />)).toThrow('useBooking must be used within BookingProvider')
    consoleSpy.mockRestore()
  })
})
