import { getPayload } from 'payload'
import config from '../../payload.config'
import { seedKemudi } from './kemudi-seed'

async function runSeed() {
  const payload = await getPayload({ config })
  
  // Force re-seed
  await seedKemudi({ payload, force: true })
  
  process.exit(0)
}

runSeed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
