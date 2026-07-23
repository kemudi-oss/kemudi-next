'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function autoRegisterUser(email: string, name: string, locale?: string) {
  const payload = await getPayload({ config })

  // Check if user already exists
  const existingUsers = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existingUsers.docs.length > 0) {
    // User already exists, return them
    return { user: existingUsers.docs[0], isNew: false }
  }

  // Create new user with locale preference from localStorage
  const newUser = await payload.create({
    collection: 'users',
    data: {
      email,
      name,
      role: 'client',
    },
  })

  // In production, send magic link email via Resend
  // await sendMagicLinkEmail(email, token)

  return { user: newUser, isNew: true }
}
