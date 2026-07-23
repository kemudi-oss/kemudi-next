import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { seedKemudi } from '@/endpoints/seed/kemudi-seed'

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json().catch(() => ({}))
    const force = body.force === true

    await seedKemudi({ payload, force })

    return NextResponse.json({ message: 'Seed completed successfully' })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Seed failed' },
      { status: 500 }
    )
  }
}
