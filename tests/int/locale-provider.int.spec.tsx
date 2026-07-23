import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import React from 'react'
import { LocaleProvider, useLocale } from '@/providers/LocaleProvider'

// Test component that uses the locale context
function TestComponent() {
  const { locale, setLocale } = useLocale()

  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <button onClick={() => setLocale('ms')}>Switch to MS</button>
      <button onClick={() => setLocale('en')}>Switch to EN</button>
    </div>
  )
}

describe('LocaleProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('provides default locale (en)', () => {
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    )

    expect(screen.getByTestId('locale')).toHaveTextContent('en')
  })

  it('updates locale when setLocale is called', async () => {
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    )

    expect(screen.getByTestId('locale')).toHaveTextContent('en')
    await act(async () => {
      screen.getByText('Switch to MS').click()
    })
    expect(screen.getByTestId('locale')).toHaveTextContent('ms')
  })

  it('persists locale to localStorage', async () => {
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    )

    await act(async () => {
      screen.getByText('Switch to MS').click()
    })
    expect(localStorage.getItem('kemudi-locale')).toBe('ms')
  })

  it('loads locale from localStorage on mount', async () => {
    localStorage.setItem('kemudi-locale', 'ms')

    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    )

    await act(async () => {
      // Wait for useEffect to run
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    expect(screen.getByTestId('locale')).toHaveTextContent('ms')
  })

  it('throws error when useLocale is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    function BadComponent() {
      useLocale()
      return null
    }

    expect(() => render(<BadComponent />)).toThrow('useLocale must be used within LocaleProvider')
    consoleSpy.mockRestore()
  })
})
