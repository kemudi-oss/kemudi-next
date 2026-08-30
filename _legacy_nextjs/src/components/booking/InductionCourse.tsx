'use client'

import React, { useState } from 'react'
import { ChevronRightIcon, ChevronLeftIcon, CheckCircleIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface InductionSlide {
  title: string
  content: string
  icon?: string
}

const defaultSlides: InductionSlide[] = [
  {
    title: 'Welcome to your first session',
    content: "It's completely normal to feel nervous before your first therapy session. Your therapist is there to support you, not to judge you.",
    icon: '🌿',
  },
  {
    title: 'What to expect',
    content: 'Your therapist will start by getting to know you. They might ask about what brought you here, your background, and what you hope to achieve.',
    icon: '📋',
  },
  {
    title: 'You are in control',
    content: "You can share as much or as little as you feel comfortable with. There's no pressure to discuss anything you're not ready for.",
    icon: '💪',
  },
  {
    title: 'It gets easier',
    content: 'The first session is often the hardest. Most people feel more comfortable after the first few sessions as trust builds.',
    icon: '🌱',
  },
  {
    title: "You've taken a brave step",
    content: "By booking this session, you've already shown courage. We're here to support you every step of the way.",
    icon: '🎉',
  },
]

interface InductionCourseProps {
  providerName?: string
  onComplete?: () => void
}

export const InductionCourse: React.FC<InductionCourseProps> = ({
  providerName = 'your therapist',
  onComplete,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [completed, setCompleted] = useState(false)

  const handleNext = () => {
    if (currentSlide < defaultSlides.length - 1) {
      setCurrentSlide((prev) => prev + 1)
    } else {
      setCompleted(true)
      onComplete?.()
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1)
    }
  }

  if (completed) {
    return (
      <section className="py-16">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircleIcon className="h-8 w-8" />
            </div>
            <h1 className="mt-6 font-heading text-2xl font-semibold text-foreground">
              You're ready for your session
            </h1>
            <p className="mt-2 text-muted-foreground">
              You've completed the induction course. We look forward to supporting you on your journey.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Your session with {providerName} is confirmed. You'll receive a reminder before your appointment.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const slide = defaultSlides[currentSlide]
  const progress = ((currentSlide + 1) / defaultSlides.length) * 100

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Slide {currentSlide + 1} of {defaultSlides.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-card text-center">
          {slide.icon && (
            <div className="text-4xl mb-4">{slide.icon}</div>
          )}
          <h2 className="font-heading text-xl font-semibold text-foreground">{slide.title}</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{slide.content}</p>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeftIcon className="h-4 w-4" /> Back
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-1 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {currentSlide === defaultSlides.length - 1 ? 'Finish' : 'Next'}{' '}
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
