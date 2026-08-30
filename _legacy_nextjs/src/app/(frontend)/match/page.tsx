'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRightIcon, ArrowLeftIcon, RotateCcwIcon, Loader2Icon } from 'lucide-react'
import { cn } from '@/utilities/ui'

const questions = [
  {
    id: 'concern',
    question: 'What brings you here today?',
    options: [
      { value: 'anxiety', label: 'Anxiety or worry' },
      { value: 'depression', label: 'Feeling down or depressed' },
      { value: 'relationship', label: 'Relationship issues' },
      { value: 'stress', label: 'Work or life stress' },
      { value: 'trauma', label: 'Trauma or past experiences' },
      { value: 'growth', label: 'Personal growth' },
      { value: 'other', label: 'Something else' },
    ],
  },
  {
    id: 'language',
    question: 'Which language are you most comfortable with?',
    options: [
      { value: 'en', label: 'English' },
      { value: 'ms', label: 'Bahasa Malaysia' },
      { value: 'zh', label: 'Chinese (Mandarin)' },
      { value: 'ta', label: 'Tamil' },
    ],
  },
  {
    id: 'format',
    question: 'How would you like to attend sessions?',
    options: [
      { value: 'online', label: 'Online (video call)' },
      { value: 'in-person', label: 'In-person' },
      { value: 'both', label: 'Either is fine' },
    ],
  },
  {
    id: 'budget',
    question: "What's your budget per session?",
    options: [
      { value: 'low', label: 'Under RM100' },
      { value: 'medium', label: 'RM100 - RM200' },
      { value: 'high', label: 'RM200 - RM300' },
      { value: 'flexible', label: 'Flexible' },
    ],
  },
  {
    id: 'approach',
    question: 'Do you have a preferred therapy approach?',
    options: [
      { value: 'cbt', label: 'CBT (Cognitive Behavioural)' },
      { value: 'psychodynamic', label: 'Psychodynamic' },
      { value: 'humanistic', label: 'Humanistic' },
      { value: 'not-sure', label: 'Not sure / No preference' },
    ],
  },
]

interface MatchResult {
  id: string
  slug?: string
  title: string
  user?: { name?: string }
  sessionFee?: number
  specialties?: Array<{ title?: string }>
}

export default function MatchPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(false)
  const [topMatch, setTopMatch] = useState<MatchResult | null>(null)
  const [runnersUp, setRunnersUp] = useState<MatchResult[]>([])

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setLoading(true)
      try {
        const res = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers }),
        })
        const data = await res.json()
        setTopMatch(data.topMatch)
        setRunnersUp(data.runnersUp || [])
        setShowResult(true)
      } catch (error) {
        console.error('Match failed:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResult(false)
    setTopMatch(null)
    setRunnersUp([])
  }

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto max-w-2xl text-center">
          <Loader2Icon className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Finding your best match...</p>
        </div>
      </section>
    )
  }

  if (showResult && topMatch) {
    const user = topMatch.user
    const initials = user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '??'

    return (
      <section className="py-16">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-6 font-heading text-2xl font-semibold text-foreground">
              We found a great match for you
            </h1>
            <p className="mt-2 text-muted-foreground">
              Based on your answers, we recommend {user?.name || 'a therapist'} for your needs.
            </p>
            <div className="mt-8 rounded-xl border border-border bg-background p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mist-sage/30 text-lg font-semibold text-deep-teal">
                  {initials}
                </div>
                <div className="text-left">
                  <h3 className="font-heading font-semibold text-foreground">{user?.name || 'Therapist'}</h3>
                  <p className="text-sm text-muted-foreground">{topMatch.title}</p>
                  {topMatch.sessionFee && (
                    <p className="text-sm text-muted-foreground">From RM{topMatch.sessionFee}/session</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/providers/${topMatch.slug || topMatch.id}`}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                View full profile
              </Link>
              <Link
                href="/providers"
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                Browse all therapists
              </Link>
            </div>
          </div>

          {runnersUp.length > 0 && (
            <div className="mt-8 text-left">
              <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
                Other matches you might like
              </h2>
              <div className="space-y-3">
                {runnersUp.map((provider) => {
                  const providerUser = provider.user
                  const providerInitials = providerUser?.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase() || '??'

                  return (
                    <Link
                      key={provider.id}
                      href={`/providers/${provider.slug || provider.id}`}
                      className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-elevated"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mist-sage/30 text-sm font-semibold text-deep-teal">
                        {providerInitials}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading font-medium text-foreground">{providerUser?.name || 'Therapist'}</h3>
                        <p className="text-xs text-muted-foreground">{provider.title}</p>
                      </div>
                      {provider.sessionFee && (
                        <p className="text-sm text-muted-foreground">RM{provider.sessionFee}</p>
                      )}
                      <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          <button
            onClick={handleRestart}
            className="mt-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <RotateCcwIcon className="h-4 w-4" /> Start over
          </button>
        </div>
      </section>
    )
  }

  if (showResult && !topMatch) {
    return (
      <section className="py-16">
        <div className="container mx-auto max-w-2xl text-center">
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            No match found
          </h1>
          <p className="mt-2 text-muted-foreground">
            We couldn't find a therapist matching your criteria. Try broadening your preferences.
          </p>
          <button
            onClick={handleRestart}
            className="mt-6 inline-flex items-center gap-1 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <RotateCcwIcon className="h-4 w-4" /> Try again
          </button>
        </div>
      </section>
    )
  }

  const q = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Question {currentQuestion + 1} of {questions.length}
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

        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <h2 className="font-heading text-xl font-semibold text-foreground">{q.question}</h2>

          <div className="mt-6 space-y-3">
            {q.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(q.id, option.value)}
                className={cn(
                  'w-full rounded-xl border p-4 text-left transition-all',
                  answers[q.id] === option.value
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/30',
                )}
              >
                <span className="text-sm font-medium text-foreground">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Back
          </button>
          <button
            onClick={handleNext}
            disabled={!answers[q.id] || loading}
            className="flex items-center gap-1 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {currentQuestion === questions.length - 1 ? 'See results' : 'Next'}{' '}
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
