import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { seedKemudi } from '@/endpoints/seed/kemudi-seed'

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config })

    // Authenticate - only admin users can seed
    const { user } = await payload.auth({ headers: request.headers })

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admin users can seed the database.' },
        { status: 403 }
      )
    }

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
