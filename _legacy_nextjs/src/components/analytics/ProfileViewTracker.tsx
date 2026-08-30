'use client'

import { useEffect } from 'react'
import { trackProfileView } from '@/utilities/analytics'

interface ProfileViewTrackerProps {
  providerId: string
  source?: string
  searchQuery?: string
}

export function ProfileViewTracker({ providerId, source, searchQuery }: ProfileViewTrackerProps) {
  useEffect(() => {
    trackProfileView(providerId, source, searchQuery)
  }, [providerId, source, searchQuery])

  return null
}
