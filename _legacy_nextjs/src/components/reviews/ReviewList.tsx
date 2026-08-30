'use client'

import React from 'react'
import { StarIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface Review {
  id: string
  rating: number
  title?: string
  content?: string
  authorName?: string
  createdAt: string
}

interface ReviewListProps {
  reviews: Review[]
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No reviews yet. Be the first to share your experience.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={cn(
                      'h-4 w-4',
                      star <= review.rating
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    )}
                  />
                ))}
              </div>
              {review.title && (
                <h4 className="mt-2 font-heading font-medium text-foreground">{review.title}</h4>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString('en-MY', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          {review.content && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.content}</p>
          )}
          {review.authorName && (
            <p className="mt-3 text-xs text-muted-foreground">— {review.authorName}</p>
          )}
        </div>
      ))}
    </div>
  )
}
