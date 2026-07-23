'use client'

import React, { useState } from 'react'
import { Loader2Icon, CheckCircleIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'

export default function ProviderSignupPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    about: '',
    specialties: '',
    qualifications: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // In production, this would submit to Payload CMS
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <section className="py-16">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-success" />
            <h1 className="mt-6 font-heading text-2xl font-semibold text-foreground">
              Application submitted
            </h1>
            <p className="mt-2 text-muted-foreground">
              Thank you for your interest in joining Kemudi. We'll review your application and get back to you within 3-5 business days.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-2xl">
        <h1 className="font-heading text-3xl font-semibold text-foreground">
          Join Kemudi as a therapist
        </h1>
        <p className="mt-2 text-muted-foreground">
          Fill out the form below to apply. We'll review your credentials and get back to you.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground">Full name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Professional title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Clinical Psychologist"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">About you *</label>
            <textarea
              required
              rows={4}
              value={formData.about}
              onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Tell us about your experience and approach..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Specialties *</label>
            <input
              type="text"
              required
              placeholder="e.g. Anxiety, Depression, Relationships"
              value={formData.specialties}
              onChange={(e) => setFormData(prev => ({ ...prev, specialties: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Qualifications & licences *</label>
            <textarea
              required
              rows={3}
              value={formData.qualifications}
              onChange={(e) => setFormData(prev => ({ ...prev, qualifications: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="List your qualifications and practising licences..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit application'
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
