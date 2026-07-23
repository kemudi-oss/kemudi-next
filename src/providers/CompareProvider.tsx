'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'

interface CompareProvider {
  id: string
  name: string
  title: string
  avatar?: string
  rating: number
  sessionFee: number
}

interface CompareContextType {
  providers: CompareProvider[]
  add: (provider: CompareProvider) => void
  remove: (id: string) => void
  clear: () => void
  isInCompare: (id: string) => boolean
}

const CompareContext = createContext<CompareContextType | null>(null)

const MAX_COMPARE = 3

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [providers, setProviders] = useState<CompareProvider[]>([])

  const add = useCallback((provider: CompareProvider) => {
    setProviders((prev) => {
      if (prev.length >= MAX_COMPARE) return prev
      if (prev.some((p) => p.id === provider.id)) return prev
      return [...prev, provider]
    })
  }, [])

  const remove = useCallback((id: string) => {
    setProviders((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const clear = useCallback(() => setProviders([]), [])

  const isInCompare = useCallback(
    (id: string) => providers.some((p) => p.id === id),
    [providers],
  )

  return (
    <CompareContext.Provider value={{ providers, add, remove, clear, isInCompare }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
