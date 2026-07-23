'use client'

import React, { useState } from 'react'
import { useBooking } from '@/providers/BookingProvider'
import { cn } from '@/utilities/ui'
import { Loader2Icon, CheckCircleIcon, HelpCircleIcon } from 'lucide-react'

interface IntakeQuestion {
  id: string
  question: string
  type: 'text' | 'textarea' | 'select'
  options?: string[]
  hint?: string
  required?: boolean
}

const defaultQuestions: IntakeQuestion[] = [
  {
    id: 'primary_concern',
    question: 'What is your primary reason for seeking therapy?',
    type: 'textarea',
    hint: 'Take your time. There are no wrong answers here.',
    required: true,
  },
  {
    id: 'previous_therapy',
    question: 'Have you attended therapy before?',
    type: 'select',
    options: ['Yes', 'No', 'Not sure'],
    hint: "It's okay if you're not sure — just do your best.",
  },
  {
    id: 'comfort_level',
    question: 'How would you rate your comfort level discussing personal topics?',
    type: 'select',
    options: ['Very comfortable', 'Somewhat comfortable', 'Neutral', 'Somewhat uncomfortable', 'Very uncomfortable'],
    hint: 'This helps your therapist understand how to approach your sessions.',
  },
  {
    id: 'goals',
    question: 'What do you hope to achieve through therapy?',
    type: 'textarea',
    hint: 'Your goals can be as specific or general as you like.',
  },
  {
    id: 'additional_notes',
    question: 'Is there anything else you would like your therapist to know before your first session?',
    type: 'textarea',
    hint: 'Optional. Share anything that feels important to you.',
  },
]

interface IntakeFormProps {
  providerId: string
  onComplete?: () => void
}

export const IntakeForm: React.FC<IntakeFormProps> = ({ providerId, onComplete }) => {
  const { setStep } = useBooking()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [healthConsent, setHealthConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hintsShown, setHintsShown] = useState<Record<string, boolean>>({})

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const toggleHint = (questionId: string) => {
    setHintsShown((prev) => ({ ...prev, [questionId]: !prev[questionId] }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      // In production, save intake form responses
      // For now, just proceed
      onComplete?.()
      setStep(4) // Move to confirmation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save intake form')
    } finally {
      setLoading(false)
    }
  }

  const isValid = defaultQuestions
    .filter((q) => q.required)
    .every((q) => answers[q.id]?.trim()) && healthConsent

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-foreground">Pre-appointment intake</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Help your therapist prepare for your first session. Take your time — there are no rush.
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-6">
        {defaultQuestions.map((question) => (
          <div key={question.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between">
              <label className="text-sm font-medium text-foreground">
                {question.question}
                {question.required && <span className="text-error ml-1">*</span>}
              </label>
              {question.hint && (
                <button
                  type="button"
                  onClick={() => toggleHint(question.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <HelpCircleIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {question.hint && hintsShown[question.id] && (
              <p className="mt-2 text-xs text-muted-foreground italic">{question.hint}</p>
            )}

            {question.type === 'text' && (
              <input
                type="text"
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            )}

            {question.type === 'textarea' && (
              <textarea
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                rows={3}
                className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            )}

            {question.type === 'select' && question.options && (
              <div className="mt-3 space-y-2">
                {question.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAnswer(question.id, option)}
                    className={cn(
                      'w-full rounded-lg border p-3 text-left text-sm transition-all',
                      answers[question.id] === option
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-border text-muted-foreground hover:border-primary/30',
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Health data consent */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-card">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={healthConsent}
            onChange={(e) => setHealthConsent(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
          />
          <span className="text-sm text-foreground">
            I consent to the processing of my health data (intake form responses) by my therapist for the purpose of providing therapy services. This data is sensitive and will be encrypted at rest. *
          </span>
        </label>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep(3)}
          disabled={loading}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || !isValid}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Continue to confirmation'
          )}
        </button>
      </div>
    </div>
  )
}
