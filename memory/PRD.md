# Kemudi — PRD

## Original Problem Statement
Build a web app: at the front, a trusted navigation and comparison platform for mental health services in Malaysia (Kemudi turns the overwhelming complexity of finding therapy into a clear, human, and supportive journey, acting as the "warm older sibling"). At the back, a therapist's portal, a qualified client referral dashboard, and a practice management solution. Monetised via a SaaS subscription for therapists — free tier limited to 5 active clients per month, paid tier unlimited.

## Architecture
- **Frontend**: React (CRA) + Tailwind + Sonner + lucide-react + React Router
- **Backend**: FastAPI + Motor (async MongoDB) + JWT (PyJWT) + bcrypt + Stripe
- **DB**: MongoDB (users, therapists, clients, referrals, payment_transactions)
- **Payments**: Stripe claimable sandbox (MY country → tax_mode = calc_only / Stripe Tax)

## User Personas
1. **Malaysian care-seeker** — overwhelmed, wants honest info, may be first-time therapy user
2. **Therapist (solo practitioner)** — wants qualified referrals + light practice management, resents SaaS bloat
3. **Curious visitor** — comparing options, not ready to reach out yet

## Core Requirements (static)
- Public directory with filters (specialty, language, price MYR, location, mode)
- Side-by-side comparison of up to 3 therapists
- Quiz-based matching (4 steps)
- Therapist detail page + referral form (public → therapist inbox)
- Therapist portal (login, overview, clients, referrals, profile, billing)
- Free tier cap: 5 active clients
- Paid tier (Kemudi Pro): RM99/month, unlimited clients + directory listing + referral inbox
- Stripe checkout for subscription upgrades

## What's Been Implemented (2026-08-30)
- Full public site: Home, /find, /therapist/:id, /compare, /quiz, /for-therapists, /about
- Auth (JWT Bearer, roles: client/therapist)
- Therapist portal with 5 tabs and free-tier gating
- Referrals system (public post + therapist status transitions)
- Stripe subscription checkout, status polling, webhook, auto-upgrade to Pro on paid
- 6 seed therapists + 1 seed client
- Design system per design_guidelines.json (Cormorant Garamond + Manrope, earthy palette)
- Empty-email coercion fix (Pydantic validator)

## Test Status
- Backend: 19/19 pytest tests pass (100%)
- Frontend: E2E flows verified (Home, Find, Compare, Quiz, Register, Portal tabs, Cap gating, Checkout redirect)
- Bug fixed: empty-string email on POST /api/portal/clients now coerces to None

## Prioritised Backlog
### P1 (short-term)
- Client-facing account: bookmark therapists, view sent referrals & their status
- Email notifications on referral status changes (SendGrid/Resend)
- Password reset flow

### P2 (mid-term)
- Session notes with timestamps under each client
- Therapist onboarding wizard (photo upload, credential verification)
- Availability calendar + session booking
- Reviews / testimonials (moderated)

### P3 (later)
- Group practice / clinic accounts
- Multi-language UI (Bahasa Malaysia, Mandarin)
- Analytics dashboard for therapists (referrals over time, conversion)
- AI "warm sibling" chat guide (deferred by user in initial scope)

## Deployment Notes
- Stripe sandbox is claimable; onboarding URL was provided in setup
- Test card: 4242 4242 4242 4242 · any future date · any CVC
- Tax mode selected: **Stripe calculates only (+0.5% per transaction)** — Malaysia is not on the Stripe managed-payments list, so Stripe calculates tax at checkout and you file returns yourself. To switch to DIY (no tax help), ask the agent.
