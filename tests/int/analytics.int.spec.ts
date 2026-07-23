import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock posthog-js
vi.mock('posthog-js', () => ({
  default: {
    capture: vi.fn(),
  },
}))

import posthog from 'posthog-js'
import {
  trackEvent,
  trackProfileView,
  trackSearchAppearance,
  trackMatchAppearance,
  trackBookingSource,
  trackComparisonAdd,
  trackServerEvent,
  trackBookingCompleted,
  trackBookingCancelled,
  trackBookingRepeat,
} from '@/utilities/analytics'

describe('Analytics Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window for client-side checks
    vi.stubGlobal('window', {})
  })

  describe('trackEvent', () => {
    it('calls posthog.capture with event and properties', () => {
      trackEvent('test_event', { key: 'value' })
      expect(posthog.capture).toHaveBeenCalledWith('test_event', {
        key: 'value',
        tracking_version: 1,
      })
    })

    it('includes tracking_version in all events', () => {
      trackEvent('test_event')
      expect(posthog.capture).toHaveBeenCalledWith('test_event', {
        tracking_version: 1,
      })
    })

    it('does not call posthog on server side', () => {
      vi.stubGlobal('window', undefined)
      trackEvent('test_event', { key: 'value' })
      expect(posthog.capture).not.toHaveBeenCalled()
    })
  })

  describe('trackProfileView', () => {
    it('tracks profile view with provider_id', () => {
      trackProfileView('123')
      expect(posthog.capture).toHaveBeenCalledWith('profile_view', {
        provider_id: '123',
        tracking_version: 1,
      })
    })

    it('tracks profile view with optional source and search_query', () => {
      trackProfileView('123', 'search', 'anxiety')
      expect(posthog.capture).toHaveBeenCalledWith('profile_view', {
        provider_id: '123',
        source: 'search',
        search_query: 'anxiety',
        tracking_version: 1,
      })
    })
  })

  describe('trackSearchAppearance', () => {
    it('tracks search appearance with required fields', () => {
      trackSearchAppearance('123', 'anxiety', 1)
      expect(posthog.capture).toHaveBeenCalledWith('search_appearance', {
        provider_id: '123',
        search_query: 'anxiety',
        page_number: 1,
        tracking_version: 1,
      })
    })

    it('tracks search appearance with optional filters', () => {
      trackSearchAppearance('123', 'anxiety', 1, { specialty: 'anxiety', language: 'en' })
      expect(posthog.capture).toHaveBeenCalledWith('search_appearance', {
        provider_id: '123',
        search_query: 'anxiety',
        page_number: 1,
        filters_applied: { specialty: 'anxiety', language: 'en' },
        tracking_version: 1,
      })
    })
  })

  describe('trackMatchAppearance', () => {
    it('tracks match appearance with score and rank', () => {
      trackMatchAppearance('123', 85.5, 1)
      expect(posthog.capture).toHaveBeenCalledWith('match_appearance', {
        provider_id: '123',
        match_score: 85.5,
        match_rank: 1,
        tracking_version: 1,
      })
    })
  })

  describe('trackBookingSource', () => {
    it('tracks booking source with provider and source', () => {
      trackBookingSource('123', 'match')
      expect(posthog.capture).toHaveBeenCalledWith('booking_source', {
        provider_id: '123',
        source: 'match',
        tracking_version: 1,
      })
    })

    it('tracks booking source with optional session duration', () => {
      trackBookingSource('123', 'search', 120)
      expect(posthog.capture).toHaveBeenCalledWith('booking_source', {
        provider_id: '123',
        source: 'search',
        session_duration_seconds: 120,
        tracking_version: 1,
      })
    })
  })

  describe('trackComparisonAdd', () => {
    it('tracks comparison add with count', () => {
      trackComparisonAdd('123', 3)
      expect(posthog.capture).toHaveBeenCalledWith('comparison_add', {
        provider_id: '123',
        comparison_count: 3,
        tracking_version: 1,
      })
    })
  })

  describe('trackServerEvent', () => {
    it('does not throw when process is undefined', () => {
      expect(() => trackServerEvent('test_event', { key: 'value' })).not.toThrow()
    })
  })

  describe('trackBookingCompleted', () => {
    it('tracks booking completed with required fields', () => {
      trackBookingCompleted('123', 'booking-456')
      expect(posthog.capture).toHaveBeenCalledWith('booking_completed', {
        provider_id: '123',
        booking_id: 'booking-456',
        tracking_version: 1,
      })
    })
  })

  describe('trackBookingCancelled', () => {
    it('tracks booking cancelled with fields', () => {
      trackBookingCancelled('123', 'booking-456', 'user', 'Changed mind')
      expect(posthog.capture).toHaveBeenCalledWith('booking_cancelled', {
        provider_id: '123',
        booking_id: 'booking-456',
        cancelled_by: 'user',
        reason: 'Changed mind',
        tracking_version: 1,
      })
    })
  })

  describe('trackBookingRepeat', () => {
    it('tracks repeat booking', () => {
      trackBookingRepeat('123', 'booking-456', 3)
      expect(posthog.capture).toHaveBeenCalledWith('booking_repeat', {
        provider_id: '123',
        booking_id: 'booking-456',
        previous_bookings_count: 3,
        tracking_version: 1,
      })
    })
  })
})
