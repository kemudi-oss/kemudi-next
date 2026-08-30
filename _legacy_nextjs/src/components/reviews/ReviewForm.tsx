'use client'

import React, { useState } from 'react'
import { StarIcon, Loader2Icon, CheckCircleIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface ReviewFormProps {
  providerId: string
  providerName: string
  onSubmitted?: () => void
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ providerId, providerName, onSubmitted }) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating || !authorName) {
      setError('Please provide a rating and your name')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: providerId,
          rating,
          title,
          content,
          authorName,
          status: 'pending',
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to submit review')
      }

      setSuccess(true)
      onSubmitted?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-success/30 bg-success/10 p-6 text-center">
        <CheckCircleIcon className="mx-auto h-8 w-8 text-success" />
        <h3 className="mt-3 font-heading font-semibold text-foreground">Review submitted</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Thank you for your review. It will be visible after admin approval.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h3 className="font-heading font-semibold text-foreground">Write a review</h3>
      <p className="mt-1 text-sm text-muted-foreground">Share your experience with {providerName}</p>

      {error && (
        <div className="mt-4 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">
          {error}
        </div>
      )}

      {/* Rating */}
      <div className="mt-4">
        <label className="text-sm font-medium text-foreground">Rating *</label>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <StarIcon
                className={cn(
                  'h-6 w-6 transition-colors',
                  (hoveredRating || rating) >= star
                    ? 'fill-primary text-primary'
                    : 'text-muted-foreground'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Author name */}
      <div className="mt-4">
        <label className="text-sm font-medium text-foreground">Your name *</label>
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="How should we display your name?"
        />
      </div>

      {/* Title */}
      <div className="mt-4">
        <label className="text-sm font-medium text-foreground">Review title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Summarize your experience"
        />
      </div>

      {/* Content */}
      <div className="mt-4">
        <label className="text-sm font-medium text-foreground">Your review</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Tell others about your experience..."
        />
      </div>

      <button
        type="submit"
        disabled={loading || !rating || !authorName}
        className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2Icon className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit review'
        )}
      </button>
    </form>
  )
}
