import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

interface MatchAnswers {
  concern?: string
  language?: string
  format?: string
  budget?: string
  approach?: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const answers: MatchAnswers = body.answers || {}

    const payload = await getPayload({ config })

    // Fetch all approved providers
    const result = await payload.find({
      collection: 'provider-profiles',
      where: {
        approvalStatus: { equals: 'approved' },
      },
      limit: 100,
      depth: 2,
    })

    // Score each provider based on answers
    const scored = result.docs.map((provider: any) => {
      let score = 0
      let maxScore = 0

      // Concern/specialty match (weight: 3)
      if (answers.concern) {
        maxScore += 3
        const specialties = provider.specialties?.map((s: any) =>
          typeof s === 'object' ? s.title?.toLowerCase() : s?.toLowerCase()
        ) || []
        if (specialties.some((s: string) => s?.includes(answers.concern!))) {
          score += 3
        }
      }

      // Language match (weight: 2)
      if (answers.language) {
        maxScore += 2
        const languages = provider.languages?.map((l: any) =>
          typeof l === 'object' ? l.code?.toLowerCase() : l?.toLowerCase()
        ) || []
        if (languages.includes(answers.language.toLowerCase())) {
          score += 2
        }
      }

      // Format match (weight: 2)
      if (answers.format && answers.format !== 'both') {
        maxScore += 2
        const formats = provider.sessionFormats?.map((f: any) => f.format) || []
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
        const approaches = provider.approaches?.map((a: any) =>
          typeof a === 'object' ? a.name?.toLowerCase() : a?.toLowerCase()
        ) || []
        if (approaches.includes(answers.approach.toLowerCase())) {
          score += 1
        }
      }

      const matchScore = maxScore > 0 ? (score / maxScore) * 100 : 0

      return {
        provider,
        score: matchScore,
      }
    })

    // Sort by score descending
    scored.sort((a: any, b: any) => b.score - a.score)

    // Get top match and runners up
    const topMatch = scored[0]?.provider || null
    const runnersUp = scored.slice(1, 4).map((s: any) => s.provider)

    // Persist response
    const sessionId = `match-${Date.now()}`
    await payload.create({
      collection: 'match-responses',
      data: {
        responses: Object.entries(answers).map(([question, answer]) => ({
          question,
          answer: answer || '',
        })),
        recommendedProvider: topMatch?.id,
        runnerUpProviders: runnersUp.map((p: any) => p.id),
        sessionId,
        timestamp: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      topMatch,
      runnersUp,
      totalProviders: result.docs.length,
    })
  } catch (error) {
    console.error('Match error:', error)
    return NextResponse.json(
      { error: 'Failed to process match' },
      { status: 500 }
    )
  }
}
