// Any setup scripts you might need go here

// Load .env files
import 'dotenv/config'

// Import jest-dom matchers for Vitest
import * as matchers from '@testing-library/jest-dom/matchers'
import { expect } from 'vitest'
expect.extend(matchers)
