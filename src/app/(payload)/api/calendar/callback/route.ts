import { NextResponse } from 'next/server'
import { exchangeCodeForTokens } from '@/utilities/calendar'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const providerId = searchParams.get('state')

  if (!code || !providerId) {
    return NextResponse.redirect(new URL('/dashboard?error=missing_params', request.url))
  }

  try {
    const tokens = await exchangeCodeForTokens(code)

    // In production, store tokens securely in database
    // For now, log them (would be encrypted in production)
    console.log('Calendar tokens received for provider:', providerId)

    return NextResponse.redirect(new URL('/dashboard?calendar=connected', request.url))
  } catch (error) {
    console.error('Calendar OAuth error:', error)
    return NextResponse.redirect(new URL('/dashboard?error=calendar_auth_failed', request.url))
  }
}
