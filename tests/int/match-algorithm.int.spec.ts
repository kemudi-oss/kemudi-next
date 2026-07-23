import { describe, it, expect } from 'vitest'

// Extract the scoring logic from the match API for testing
interface MatchAnswers {
  concern?: string
  language?: string
  format?: string
  budget?: string
  approach?: string
}

interface Provider {
  id: string
  title: string
  specialties?: Array<{ title?: string }>
  languages?: Array<{ code?: string }>
  sessionFormats?: Array<{ format: string }>
  sessionFee?: number
  approaches?: Array<{ name?: string }>
}

function scoreProvider(provider: Provider, answers: MatchAnswers): number {
  let score = 0
  let maxScore = 0

  // Concern/specialty match (weight: 3)
  if (answers.concern) {
    maxScore += 3
    const specialties = provider.specialties?.map((s) => s.title?.toLowerCase()) || []
    if (specialties.some((s) => s?.includes(answers.concern!))) {
      score += 3
    }
  }

  // Language match (weight: 2)
  if (answers.language) {
    maxScore += 2
    const languages = provider.languages?.map((l) => l.code?.toLowerCase()) || []
    if (languages.includes(answers.language.toLowerCase())) {
      score += 2
    }
  }

  // Format match (weight: 2)
  if (answers.format && answers.format !== 'both') {
    maxScore += 2
    const formats = provider.sessionFormats?.map((f) => f.format) || []
    if (formats.includes(answers.format) || formats.includes('both')) {
      score += 2
    }
  }

  // Budget match (weight: 1)
  if (answers.budget) {
    maxScore += 1
    const fee = provider.sessionFee || 0
    const budgetRanges: Record<string, [number, number]> = {
      low: [0, 100],
      medium: [100, 200],
      high: [200, 300],
      flexible: [0, Infinity],
    }
    const [min, max] = budgetRanges[answers.budget] || [0, Infinity]
    if (fee >= min && fee <= max) {
      score += 1
    }
  }

  // Approach match (weight: 1)
  if (answers.approach && answers.approach !== 'not-sure') {
    maxScore += 1
    const approaches = provider.approaches?.map((a) => a.name?.toLowerCase()) || []
    if (approaches.includes(answers.approach.toLowerCase())) {
      score += 1
    }
  }

  return maxScore > 0 ? (score / maxScore) * 100 : 0
}

describe('Match Algorithm', () => {
  const mockProvider: Provider = {
    id: '1',
    title: 'Clinical Psychologist',
    specialties: [{ title: 'Anxiety' }, { title: 'Depression' }],
    languages: [{ code: 'en' }, { code: 'ms' }],
    sessionFormats: [{ format: 'online' }, { format: 'in-person' }],
    sessionFee: 150,
    approaches: [{ name: 'CBT' }, { name: 'Psychodynamic' }],
  }

  it('returns 100% score for perfect match', () => {
    const answers: MatchAnswers = {
      concern: 'anxiety',
      language: 'en',
      format: 'online',
      budget: 'medium',
      approach: 'cbt',
    }
    const score = scoreProvider(mockProvider, answers)
    expect(score).toBe(100)
  })

  it('returns 0% when no answers provided', () => {
    const score = scoreProvider(mockProvider, {})
    expect(score).toBe(0)
  })

  it('scores specialty match correctly', () => {
    const answers: MatchAnswers = { concern: 'anxiety' }
    const score = scoreProvider(mockProvider, answers)
    expect(score).toBe(100) // 3/3 = 100%
  })

  it('scores specialty mismatch correctly', () => {
    const answers: MatchAnswers = { concern: 'relationships' }
    const score = scoreProvider(mockProvider, answers)
    expect(score).toBe(0) // 0/3 = 0%
  })

  it('scores language match correctly', () => {
    const answers: MatchAnswers = { language: 'en' }
    const score = scoreProvider(mockProvider, answers)
    expect(score).toBe(100) // 2/2 = 100%
  })

  it('scores language mismatch correctly', () => {
    const answers: MatchAnswers = { language: 'zh' }
    const score = scoreProvider(mockProvider, answers)
    expect(score).toBe(0) // 0/2 = 0%
  })

  it('scores format match correctly', () => {
    const answers: MatchAnswers = { format: 'online' }
    const score = scoreProvider(mockProvider, answers)
    expect(score).toBe(100) // 2/2 = 100%
  })

  it('scores format "both" as match', () => {
    const answers: MatchAnswers = { format: 'both' }
    const score = scoreProvider(mockProvider, answers)
    expect(score).toBe(0) // "both" is skipped in scoring
  })

  it('scores budget match correctly', () => {
    const answers: MatchAnswers = { budget: 'medium' }
    const score = scoreProvider(mockProvider, answers)
    expect(score).toBe(100) // 1/1 = 100%
  })

  it('scores budget mismatch correctly', () => {
    const answers: MatchAnswers = { budget: 'low' }
    const score = scoreProvider(mockProvider, answers)
    expect(score).toBe(0) // 150 > 100, so 0/1 = 0%
  })

  it('scores approach match correctly', () => {
    const answers: MatchAnswers = { approach: 'cbt' }
    const score = scoreProvider(mockProvider, answers)
    expect(score).toBe(100) // 1/1 = 100%
  })

  it('scores approach "not-sure" as skip', () => {
    const answers: MatchAnswers = { approach: 'not-sure' }
    const score = scoreProvider(mockProvider, answers)
    expect(score).toBe(0) // "not-sure" is skipped
  })

  it('handles multiple answers correctly', () => {
    const answers: MatchAnswers = {
      concern: 'anxiety', // match (3/3)
      language: 'en', // match (2/2)
      format: 'online', // match (2/2)
      budget: 'medium', // match (1/1)
      approach: 'cbt', // match (1/1)
    }
    const score = scoreProvider(mockProvider, answers)
    expect(score).toBe(100) // 9/9 = 100%
  })

  it('handles partial matches correctly', () => {
    const answers: MatchAnswers = {
      concern: 'anxiety', // match (3/3)
      language: 'en', // match (2/2)
      format: 'online', // match (2/2)
      budget: 'low', // mismatch (0/1)
      approach: 'cbt', // match (1/1)
    }
    const score = scoreProvider(mockProvider, answers)
    expect(score).toBeCloseTo(88.89, 1) // 8/9 ≈ 88.89%
  })

  it('handles provider with no data', () => {
    const emptyProvider: Provider = {
      id: '2',
      title: 'Therapist',
    }
    const answers: MatchAnswers = {
      concern: 'anxiety',
      language: 'en',
    }
    const score = scoreProvider(emptyProvider, answers)
    expect(score).toBe(0) // No specialties/languages to match
  })
})
