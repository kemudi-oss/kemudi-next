'use client'

import posthog from 'posthog-js'

const TRACKING_VERSION = 1

export function trackEvent(event: string, properties: Record<string, any> = {}) {
  if (typeof window === 'undefined') return

  posthog.capture(event, {
    ...properties,
    tracking_version: TRACKING_VERSION,
  })
}

// Client-side events
export function trackProfileView(providerId: string, source?: string, searchQuery?: string) {
  trackEvent('profile_view', {
    provider_id: providerId,
    source,
    search_query: searchQuery,
  })
}

export function trackSearchAppearance(providerId: string, searchQuery: string, pageNumber: number, filters?: Record<string, string>) {
  trackEvent('search_appearance', {
    provider_id: providerId,
    search_query: searchQuery,
    page_number: pageNumber,
    filters_applied: filters,
  })
}

export function trackMatchAppearance(providerId: string, matchScore: number, matchRank: number) {
  trackEvent('match_appearance', {
    provider_id: providerId,
    match_score: matchScore,
    match_rank: matchRank,
  })
}

export function trackBookingSource(providerId: string, source: string, sessionDuration?: number) {
  trackEvent('booking_source', {
    provider_id: providerId,
    source,
    session_duration_seconds: sessionDuration,
  })
}

export function trackComparisonAdd(providerId: string, comparisonCount: number) {
  trackEvent('comparison_add', {
    provider_id: providerId,
    comparison_count: comparisonCount,
  })
}

// Server-side events (for use in API routes)
export function trackServerEvent(event: string, properties: Record<string, any> = {}) {
  // Use posthog-node for server-side tracking
  // For now, use the same capture function
  if (typeof window === 'undefined') {
    // Server-side: use posthog-node or log
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.log('[PostHog]', event, properties)
    }
  } else {
    // Client-side fallback
    posthog.capture(event, {
      ...properties,
      tracking_version: TRACKING_VERSION,
    })
  }
}

export function trackBookingCompleted(providerId: string, bookingId: string, intakeRequired?: boolean, bookingValue?: number) {
  trackServerEvent('booking_completed', {
    provider_id: providerId,
    booking_id: bookingId,
    intake_required: intakeRequired,
    booking_value: bookingValue,
  })
}

export function trackBookingCancelled(providerId: string, bookingId: string, cancelledBy?: string, reason?: string) {
  trackServerEvent('booking_cancelled', {
    provider_id: providerId,
    booking_id: bookingId,
    cancelled_by: cancelledBy,
    reason,
  })
}

export function trackBookingRepeat(providerId: string, bookingId: string, previousBookingsCount?: number) {
  trackServerEvent('booking_repeat', {
    provider_id: providerId,
    booking_id: bookingId,
    previous_bookings_count: previousBookingsCount,
  })
}
