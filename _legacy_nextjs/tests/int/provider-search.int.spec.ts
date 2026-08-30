import { describe, it, expect } from 'vitest'

// Extract the where clause construction logic for testing
interface SearchParams {
  query?: string
  specialty?: string
  language?: string
  format?: string
  maxPrice?: number
}

function buildWhereClause(params: SearchParams): Record<string, any> {
  const where: Record<string, any> = { approvalStatus: { equals: 'approved' } }

  if (params.query) {
    where.or = [
      { title: { contains: params.query } },
      { 'user.name': { contains: params.query } },
    ]
  }

  if (params.specialty) {
    where.specialties = { contains: params.specialty }
  }

  if (params.language) {
    where.languages = { contains: params.language }
  }

  if (params.format) {
    where['sessionFormats.format'] = { equals: params.format }
  }

  if (params.maxPrice && params.maxPrice < 500) {
    where.sessionFee = { less_than_equal: params.maxPrice }
  }

  return where
}

describe('Provider Search', () => {
  it('creates basic where clause with approval status', () => {
    const where = buildWhereClause({})
    expect(where).toEqual({
      approvalStatus: { equals: 'approved' },
    })
  })

  it('adds keyword search', () => {
    const where = buildWhereClause({ query: 'anxiety' })
    expect(where.or).toEqual([
      { title: { contains: 'anxiety' } },
      { 'user.name': { contains: 'anxiety' } },
    ])
  })

  it('adds specialty filter', () => {
    const where = buildWhereClause({ specialty: 'anxiety' })
    expect(where.specialties).toEqual({ contains: 'anxiety' })
  })

  it('adds language filter', () => {
    const where = buildWhereClause({ language: 'en' })
    expect(where.languages).toEqual({ contains: 'en' })
  })

  it('adds format filter', () => {
    const where = buildWhereClause({ format: 'online' })
    expect(where['sessionFormats.format']).toEqual({ equals: 'online' })
  })

  it('adds price filter when maxPrice < 500', () => {
    const where = buildWhereClause({ maxPrice: 200 })
    expect(where.sessionFee).toEqual({ less_than_equal: 200 })
  })

  it('does not add price filter when maxPrice >= 500', () => {
    const where = buildWhereClause({ maxPrice: 500 })
    expect(where.sessionFee).toBeUndefined()
  })

  it('combines all filters', () => {
    const where = buildWhereClause({
      query: 'sarah',
      specialty: 'anxiety',
      language: 'en',
      format: 'online',
      maxPrice: 200,
    })
    expect(where).toEqual({
      approvalStatus: { equals: 'approved' },
      or: [
        { title: { contains: 'sarah' } },
        { 'user.name': { contains: 'sarah' } },
      ],
      specialties: { contains: 'anxiety' },
      languages: { contains: 'en' },
      'sessionFormats.format': { equals: 'online' },
      sessionFee: { less_than_equal: 200 },
    })
  })
})
