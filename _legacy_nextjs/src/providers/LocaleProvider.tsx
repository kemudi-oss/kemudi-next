'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Locale = 'en' | 'ms'

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextType | null>(null)

const STORAGE_KEY = 'kemudi-locale'
const DEFAULT_LOCALE: Locale = 'en'

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && (stored === 'en' || stored === 'ms')) {
      setLocaleState(stored)
    }
    setMounted(true)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
    // Sync to DB would happen here when user is logged in
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <LocaleContext.Provider value={{ locale: DEFAULT_LOCALE, setLocale: () => {} }}>
        {children}
      </LocaleContext.Provider>
    )
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
