import type { Payload } from 'payload'

export const seedKemudi = async ({ payload, force = false }: { payload: Payload; force?: boolean }): Promise<void> => {
  payload.logger.info('Seeding Kemudi database...')

  // Check if already seeded
  const users = await payload.find({
    collection: 'users',
    limit: 1,
  })

  if (users.totalDocs > 0 && !force) {
    payload.logger.info('Database already seeded. Use force=true to re-seed.')
    return
  }

  // If force, delete existing data
  if (force && users.totalDocs > 0) {
    payload.logger.info('Force re-seed: clearing existing data...')
    const collections = ['bookings', 'reviews', 'interests', 'match-responses', 'licenses'] as const
    for (const collection of collections) {
      try {
        await payload.delete({
          collection,
          where: {},
        })
      } catch (e) {
        // Collection might not exist yet
      }
    }
  }

  // 1. Create admin user
  payload.logger.info('— Creating admin user...')
  const timestamp = Date.now()
  const admin = await payload.create({
    collection: 'users',
    data: {
      email: `admin-${timestamp}@kemudi.com`,
      name: 'Admin User',
      password: 'admin123',
      role: 'admin',
    },
  })

  // 2. Create provider users
  payload.logger.info('— Creating provider users...')
  const providerUsers = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        email: `sarah.chen-${timestamp}@kemudi.com`,
        name: 'Dr. Sarah Chen',
        password: 'provider123',
        role: 'provider',
      },
    }),
    payload.create({
      collection: 'users',
      data: {
        email: `ahmad.rashid-${timestamp}@kemudi.com`,
        name: 'Ahmad Rashid',
        password: 'provider123',
        role: 'provider',
      },
    }),
    payload.create({
      collection: 'users',
      data: {
        email: `priya.sharma-${timestamp}@kemudi.com`,
        name: 'Priya Sharma',
        password: 'provider123',
        role: 'provider',
      },
    }),
  ])

  // 3. Create client user
  payload.logger.info('— Creating client user...')
  const client = await payload.create({
    collection: 'users',
    data: {
      email: `client-${timestamp}@kemudi.com`,
      name: 'Test Client',
      password: 'client123',
      role: 'client',
    },
  })

  // 4. Create languages
  payload.logger.info('— Creating languages...')
  const existingLanguages = await payload.find({ collection: 'languages', limit: 10 })
  const languages = existingLanguages.totalDocs > 0 ? existingLanguages.docs : await Promise.all([
    payload.create({ collection: 'languages', data: { name: 'English', code: 'en' } }),
    payload.create({ collection: 'languages', data: { name: 'Bahasa Malaysia', code: 'ms' } }),
    payload.create({ collection: 'languages', data: { name: 'Chinese (Mandarin)', code: 'zh' } }),
    payload.create({ collection: 'languages', data: { name: 'Tamil', code: 'ta' } }),
  ])
  // Extract IDs for relationship fields
  const languageIds = languages.map((l: any) => l.id)

  // 5. Create specialties
  payload.logger.info('— Creating specialties...')
  const existingSpecialties = await payload.find({ collection: 'specialties', limit: 10 })
  const specialties = existingSpecialties.totalDocs > 0 ? existingSpecialties.docs : await Promise.all([
    payload.create({ collection: 'specialties', data: { title: 'Anxiety', slug: 'anxiety', description: 'Treatment for anxiety disorders and worry' } }),
    payload.create({ collection: 'specialties', data: { title: 'Depression', slug: 'depression', description: 'Treatment for depressive disorders' } }),
    payload.create({ collection: 'specialties', data: { title: 'Relationship Issues', slug: 'relationship-issues', description: 'Couples and family therapy' } }),
    payload.create({ collection: 'specialties', data: { title: 'Trauma', slug: 'trauma', description: 'Trauma and PTSD treatment' } }),
    payload.create({ collection: 'specialties', data: { title: 'Stress Management', slug: 'stress-management', description: 'Work and life stress coping' } }),
    payload.create({ collection: 'specialties', data: { title: 'Personal Growth', slug: 'personal-growth', description: 'Self-improvement and development' } }),
  ])
  // Extract IDs for relationship fields
  const specialtyIds = specialties.map((s: any) => s.id)

  // 6. Create approaches
  payload.logger.info('— Creating approaches...')
  const existingApproaches = await payload.find({ collection: 'approaches', limit: 10 })
  const approaches = existingApproaches.totalDocs > 0 ? existingApproaches.docs : await Promise.all([
    payload.create({ collection: 'approaches', data: { name: 'CBT', slug: 'cbt', description: 'Cognitive Behavioural Therapy' } }),
    payload.create({ collection: 'approaches', data: { name: 'DBT', slug: 'dbt', description: 'Dialectical Behaviour Therapy' } }),
    payload.create({ collection: 'approaches', data: { name: 'EMDR', slug: 'emdr', description: 'Eye Movement Desensitization and Reprocessing' } }),
    payload.create({ collection: 'approaches', data: { name: 'Psychodynamic', slug: 'psychodynamic', description: 'Psychodynamic therapy' } }),
    payload.create({ collection: 'approaches', data: { name: 'Humanistic', slug: 'humanistic', description: 'Humanistic therapy' } }),
    payload.create({ collection: 'approaches', data: { name: 'ACT', slug: 'act', description: 'Acceptance and Commitment Therapy' } }),
  ])
  // Extract IDs for relationship fields
  const approachIds = approaches.map((a: any) => a.id)

  // 7. Create provider profiles
  payload.logger.info('— Creating provider profiles...')
  const provider1 = await payload.create({
    collection: 'provider-profiles',
    data: {
      user: providerUsers[0].id,
      title: 'Clinical Psychologist',
      approvalStatus: 'approved',
      accountStatus: 'active',
      sessionFee: 150,
      currency: 'MYR',
      sessionFormats: [
        { format: 'online' },
        { format: 'in-person', location: 'Kuala Lumpur' },
      ],
      languages: languageIds.slice(0, 2),
      specialties: specialtyIds.slice(0, 2),
      approaches: [{ name: 'CBT' }, { name: 'Psychodynamic' }],
      about: 'Dr. Sarah Chen is a clinical psychologist with over 10 years of experience in treating anxiety and depression. She uses evidence-based approaches including CBT and psychodynamic therapy.',
      philosophy: 'I believe in creating a safe, non-judgmental space where you can explore your thoughts and feelings at your own pace.',
      religion: 'none',
      location: {
        address: 'Bangsar, Kuala Lumpur',
        lat: 3.1319,
        lng: 101.684,
      },
    },
  })

  const provider2 = await payload.create({
    collection: 'provider-profiles',
    data: {
      user: providerUsers[1].id,
      title: 'Licensed Counsellor',
      approvalStatus: 'approved',
      accountStatus: 'active',
      sessionFee: 120,
      currency: 'MYR',
      sessionFormats: [
        { format: 'online' },
        { format: 'in-person', location: 'Petaling Jaya' },
      ],
      languages: [languages[0].id, languages[1].id],
      specialties: [specialties[2].id, specialties[4].id],
      approaches: [{ name: 'DBT' }, { name: 'Humanistic' }],
      about: 'Ahmad Rashid is a licensed counsellor specializing in relationship issues and stress management. He provides a warm, supportive environment for couples and individuals.',
      philosophy: 'Every relationship has its challenges. Together, we can find new ways to connect and communicate.',
      religion: 'islam',
      location: {
        address: 'Petaling Jaya, Selangor',
        lat: 3.1073,
        lng: 101.6067,
      },
    },
  })

  const provider3 = await payload.create({
    collection: 'provider-profiles',
    data: {
      user: providerUsers[2].id,
      title: 'Psychiatrist',
      approvalStatus: 'approved',
      accountStatus: 'active',
      sessionFee: 200,
      currency: 'MYR',
      sessionFormats: [
        { format: 'online' },
        { format: 'in-person', location: 'Petaling Jaya' },
      ],
      languages: [languages[0].id, languages[2].id],
      specialties: [specialties[0].id, specialties[3].id, specialties[5].id],
      approaches: [{ name: 'EMDR' }, { name: 'ACT' }],
      about: 'Dr. Priya Sharma is a psychiatrist with expertise in trauma and anxiety disorders. She combines medication management with psychotherapy for comprehensive care.',
      philosophy: 'Mental health is health. I take a holistic approach to treatment, combining medication with therapy when appropriate.',
      religion: 'hinduism',
      location: {
        address: 'Damansara Heights, Kuala Lumpur',
        lat: 3.1569,
        lng: 101.6663,
      },
    },
  })

  // 8. Create licences
  payload.logger.info('— Creating licences...')
  await Promise.all([
    payload.create({
      collection: 'licenses',
      data: {
        provider: provider1.id,
        type: 'LKM Practising Certificate',
        number: 'LKM-2024-001',
        issuingBody: 'Lembaga Kaunselor Malaysia',
        expiryDate: '2027-12-31',
      },
    }),
    payload.create({
      collection: 'licenses',
      data: {
        provider: provider2.id,
        type: 'LKM Practising Certificate',
        number: 'LKM-2024-002',
        issuingBody: 'Lembaga Kaunselor Malaysia',
        expiryDate: '2027-06-30',
      },
    }),
    payload.create({
      collection: 'licenses',
      data: {
        provider: provider3.id,
        type: 'MAHPC Registration',
        number: 'MAHPC-2024-003',
        issuingBody: 'Malaysian Allied Health Professions Council',
        expiryDate: '2027-09-30',
      },
    }),
  ])

  // 9. Create bookings
  payload.logger.info('— Creating bookings...')
  await Promise.all([
    payload.create({
      collection: 'bookings',
      data: {
        provider: provider1.id,
        user: client.id,
        dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        bookingStatus: 'confirmed',
        clientName: 'Test Client',
        clientEmail: 'client@kemudi.com',
      },
    }),
    payload.create({
      collection: 'bookings',
      data: {
        provider: provider2.id,
        user: client.id,
        dateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
        bookingStatus: 'pending',
        clientName: 'Test Client',
        clientEmail: 'client@kemudi.com',
      },
    }),
  ])

  // 10. Create reviews
  payload.logger.info('— Creating reviews...')
  await Promise.all([
    payload.create({
      collection: 'reviews',
      data: {
        provider: provider1.id,
        rating: 5,
        title: 'Excellent therapist',
        content: 'Dr. Chen helped me through a very difficult time. Her approach is warm and professional.',
        authorName: 'Anonymous',
        status: 'approved',
      },
    }),
    payload.create({
      collection: 'reviews',
      data: {
        provider: provider1.id,
        rating: 4,
        title: 'Very helpful',
        content: 'Good sessions, though sometimes felt a bit rushed.',
        authorName: 'Anonymous',
        status: 'approved',
      },
    }),
    payload.create({
      collection: 'reviews',
      data: {
        provider: provider2.id,
        rating: 5,
        title: 'Great counsellor',
        content: 'Ahmad helped us improve our communication significantly.',
        authorName: 'Anonymous',
        status: 'approved',
      },
    }),
  ])

  // 11. Update global settings
  payload.logger.info('— Updating global settings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      inductionCourseRepeatMonths: 6,
      slotReservationMinutes: 10,
    },
  })

  payload.logger.info('✅ Kemudi seed completed!')
  payload.logger.info('')
  payload.logger.info('Test accounts:')
  payload.logger.info('  Admin: admin@kemudi.com / admin123')
  payload.logger.info('  Provider 1: sarah.chen@kemudi.com / provider123')
  payload.logger.info('  Provider 2: ahmad.rashid@kemudi.com / provider123')
  payload.logger.info('  Provider 3: priya.sharma@kemudi.com / provider123')
  payload.logger.info('  Client: client@kemudi.com / client123')
}
