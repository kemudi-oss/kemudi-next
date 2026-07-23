# SPEC — Kemudi

## §G Goal

Malaysian mental health navigation platform. Users find, compare, book therapists.
Providers list services, manage availability, receive bookings.
Trust via reviews, moderation, transparent pricing.

## §C Constraints

- Next.js App Router + Payload CMS v3 on Vercel
- PostgreSQL via Neon, Vercel Blob for files
- shadcn/ui + Tailwind v4 + Radix UI
- EN primary, MS secondary (CN/TN future)
- Mobile-first responsive
- SSR for SEO
- Resend for transactional email
- PostHog for analytics
- ! pass Core Web Vitals
- PDPA compliance for Malaysian users

## §I Interfaces

### External surfaces
- `GET /` — homepage hero + value prop + CTA
- `GET /providers?q=&specialty=&language=&format=&page=` — filtered provider list
- `GET /providers/[slug]` — provider detail (tabs: about, services, reviews)
- `GET /providers/[slug]/book` — multi-step booking (service → time → details → payment → intake → confirmation)
- `GET /compare?ids=` — side-by-side provider comparison (max 4, enforced client+server)
- `GET /match` — therapist matching quiz → results
- `GET /search?q=` — global search (posts + providers)
- `GET /posts` — blog listing
- `GET /posts/[slug]` — blog post
- `GET /centres` — browse therapy centres/organisations
- `GET /centres/[slug]` — centre page: photos, writeup, map, directions, therapist list, booking
- `GET /[slug]` — CMS pages
- `GET /privacy` — privacy policy (PDPA)
- `GET /account` — user account management (profile, bookings, data export, deletion)
- `GET /dashboard` — provider self-service: bookings, availability, analytics, Google Calendar sync
- `GET /dashboard/analytics` — provider analytics: views, search/match appearances (time-series)
- `GET /admin/dashboard` — admin dashboard: all providers overview, "view as" selector
- `GET /admin/dashboard?provider=<id>` — admin view of specific provider's analytics + bookings

### Payload collections
- `provider-profiles` — education, licences (`licenses`), specialties (`specialties`), approaches (`approaches` m2m w/ qualification proof), languages, pricing, session formats, location (address + coordinates), religion ?, centre membership (`centres` m2m), intake form config, SEO, `status` (pending|approved|rejected|suspended|withdrawn). Uses Payload native versioning — §V17.
- `licenses` — licence type, number, issuing body, file upload proof, expiry date. Linked to `provider-profiles`. Expiry tracking + proactive reminders (§V19). Changes part of revisioning (§V17). Initial submission covered by T19.
- `specialties` — shared categories (Anxiety, Depression, etc.). Renamed from `services`. Cross-provider filtering, no duplication.
- `approaches` — therapeutic approaches (CBT, DBT, EMDR, etc.). Renamed from "modalities". M2m w/ `provider-profiles`. Each relation ! qualification proof upload.
- `centres` — name, description, photos, address, map coords, directions. M2m w/ `provider-profiles` (bidirectional).
- `bookings` — Payload native drafts. Draft = unpaid reservation (! visible). Published = paid (visible to provider). Fields: user, provider, service, datetime, status (pending|confirmed|completed|cancelled|no-show), payment, `reservedUntil`, `inductionCompleted`. Draft on slot selection (§V20). Published on payment (status=pending). Confirmed on intake done (or ! required). `inductionCompleted` tracks post-confirmation induction course.
- `reviews` — rating, text, status (pending|approved|rejected). All → admin moderation. Only `approved` ! public (§V3). Pending ! visible to author + admin only.
- `match-responses` — quiz answers, matched provider(s), match score. Improve matching algorithm.
- `interests` — user email, provider ref, timestamp. Captures interest when provider ! expired licence (§V19).
- `languages` — supported languages
- `categories` — content categories
- `users` — auth, roles (admin|provider|client), magic link token, ? password hash, locale preference, consent record (PDPA). Auto-created during booking (§V2).
- `pages` — CMS pages
- `posts` — blog posts
- `media` — uploads
- `consent-logs` — user ref, consent type, consented ts, withdrawn ts, IP. PDPA audit trail.

### Admin
- Payload admin → `/admin`
- Provider self-service → `/dashboard`

### Global settings
- `inductionCourseRepeatMonths` — months before re-showing induction (default: 6)
- `slotReservationMinutes` — minutes slot held before release (default: 10)

## §V Invariants

V1: provider search → only `status=approved` (platform approval, ≠ revision approval — §V17)
V2: booking flow → auto-register user (email + name, `client` role) → booking steps. Auth: magic link default. ? password → email + password login. Magic link always fallback.
V3: reviews → `status=approved` ! public. All reviews → admin moderation queue. Pending ! visible to author + admin only.
V4: match quiz → persist responses, real match (! hardcoded). Considers: specialties, approaches, languages, session format (online|in-person), budget range, religion preference (if provided).
V5: booking steps → atomic, ! skip ahead. Inapplicable steps (e.g. intake ! required) → auto-skip, ! user-skip.
V6: payment ! before draft publish. Payment fail → draft stays unpublished, user retries. Unpublished drafts → Payload cleanup. Published bookings status=pending → ! auto-cancelled. Appointment reminders → intake form reminders.
V7: provider availability → recurring weekly slots. Before confirm → check: (a) provider slots, (b) Google Calendar external events, (c) published bookings (any status: pending|confirmed|completed). All ! clear → slot bookable. Outlook future.
V8: comparison URL → encodes provider IDs, ! auth required. Max 4 providers (enforced server-side; 400 if exceeded).
V9: ! public pages SSR'd + proper meta tags for SEO.
V10: email → booking confirmation (Resend). Includes .ics calendar invite.
V11: intake form → post-payment step. If provider ! requires → user ! complete before `pending` → `confirmed`. Soft hint texts → guide "I'm not sure" on hesitant questions. If ! required → payment alone → `confirmed`.
V12: locale preference → localStorage default. Sync to DB on account creation (§V2). Persists until user changes.
V13: mobile layout → functional at 320px min.
V14: booked appointments → push to provider's Google Calendar. External events → pull from Google Calendar → store as blocking appointments in DB. Outlook future.
V15: review moderation → all reviews → admin queue. Only `approved` ! public.
V16: each approach → qualification proof upload. Provider ! list approach ! proof.
V17: provider profile revisioning → Payload native versioning (`versions: { drafts: true }`). Every edit → draft. Non-safety (bio, FAQ, location, religion, pricing) → auto-published via beforeChange hook. Safety (specialties, approaches, education, licences) → draft ! admin approval → publish. Until published → public shows most recently published revision, matching uses that revision. New providers (status=pending) → initial approval (T19) → versioning activates.
V18: provider religion → optional, filterable/matchable. Clients filter by positive ("want X") or negative ("prefer not X"). Matching uses preference. Providers ! religion → excluded from religion filtering.
V19: licences → tracked with expiry dates. Expired → hidden from search + matching. Bookings ! blocked. Users → register interest (`interests`) → re-engagement on renewal. Proactive emails: 30d, 7d, 1d before expiry. Renewal ! pending notifications → cancelled. Dashboard reminders + admin notification.
V20: slot reservation → Payload drafts. User selects slot → draft with `reservedUntil` (default 10min, configurable). Drafts ! visible in queries/dashboards. Before create → check: published bookings (any status) + active drafts (`reservedUntil > now`) on same slot. Either exists → ! available. Payment ! `reservedUntil` → draft published (status=pending). `reservedUntil` expires → draft stays unpublished, Payload cleanup (! background jobs). Concurrent: first draft wins.
V21: Google Calendar → OAuth 2.0 + refresh tokens. Provider → OAuth flow from `/dashboard`. Refresh token encrypted in DB. Access tokens auto-refresh (`googleapis`). Revocation (401|403) → re-auth prompt. FreeBusy API → external events (≠ full details). Rate limits ! concern at Kemudi scale.
V22: auth → magic link default (15min expiry). ? password → email + password. Passwords bcrypt-hashed. Session → Payload CMS auth (JWT). OAuth tokens (Google Calendar) → PostgreSQL users collection, encrypted fields, ≠ auth tokens.
V23: revision archival → Payload native versioning. Draft revisions ! published → cleanup 90 days. Published revisions → per Payload config. ! custom logic needed.
V24: PDPA compliance:
  - Consent → explicit, account creation (checkbox, ! pre-ticked). `consent-logs` + timestamp + IP. Granular: marketing vs platform.
  - Privacy policy → `/privacy` (data collected, purpose, retention, sharing, rights).
  - Right to access → data export from `/account`. Delivered ≤ 21 days.
  - Right to deletion → `/account`. Soft-delete 30d grace → purged. Active bookings ! complete/cancel first.
  - Retention → user data ! account active. Deleted → purged 30d. Bookings → 7yr. Consent logs → 3yr.
  - Breach → ≤ 72h notify PDPA Commissioner + affected users. Playbook maintained.
  - Health data → intake form responses = sensitive. Explicit consent ! processing. Encrypted at rest. Provider specialties = public ≠ sensitive.
  - Cross-border → Vercel (US) + Neon (US). DPAs ! place. Users notified in privacy policy.

V25: cancellation + refund:
  - User → cancel through system. ! auto-refund. Case-by-case: coupons (prioritised) | card refund (Stripe).
  - Provider → request reschedule. ! cancel directly. Cancel → contact support.
  - Admin → cancel any booking. Audit trail !. Last resort when reschedule ! possible.
  - Refunds → Stripe (≠ Kemudi backend). Coupons always first. Card via Stripe when coupons ! viable.

V26: provider analytics → PostHog (§C). Events involving provider's profile → `provider_id` property. Provider = PostHog person (`distinct_id = user.id`) only when acting as logged-in user. Dashboard → PostHog Insights API filtered by `provider_id`. Admin → filter by any provider's `provider_id` via "view as". PostHog handles ingestion + storage + aggregation (! custom pipeline). Dashboard UI → in-house, Kemudi design. ! PostHog down → analytics unavailable (non-critical).

### Analytics dashboard — prioritized sections

**S1: Overview (high)**
Cards: current vs previous period + trend arrows:
- Profile views (count + % change)
- Search appearances (count + % change)
- Match appearances (count + % change)
- Booking conversion rate (bookings ÷ views × 100 + % change)

**S2: Booking insights (high)**
- Conversion funnel → horizontal bar: search → views → bookings (drop-off)
- Source breakdown → donut: search|match|comparison|direct
- Booking trend → line chart (weekly|monthly toggle)

**S3: Reviews (high)**
- Average rating → large number + stars + trend
- Distribution → horizontal bar: 5★→1★
- Review count + % change

**S4: Client insights (medium)**
- Top search terms → word cloud | top-10 list
- Language preference → bar chart
- Session format demand → bar chart: online|in-person|both

**S5: Availability (medium)**
- Slot utilization → gauge | %
- Most booked slots → heatmap: day × time
- Least booked slots → heatmap

**S6: Engagement (medium)**
- Comparison appearances → count + trend
- Match-to-booking conversion → %

**S7: Client retention (low)**
- Repeat client rate → %
- Cancellation rate → cancelled ÷ total

**Date range**: 7d | 30d | 90d | 12m | custom. Default: 30d.

**Admin view-as**: `/admin/dashboard` same sections + provider selector dropdown. Overview → drill into specific provider.

### Tracking plan

All events → PostHog via `src/utilities/analytics.ts`. Every event → `tracking_version` property.

**Versioning**: `TRACKING_VERSION = 1`. Schema change → increment version. Query by `tracking_version` → compare across changes. Old events ! retroactively updated.

**Events**:

| event | fires when | required | optional |
|-------|-----------|----------|----------|
| `profile_view` | `/providers/[slug]` view | `provider_id` | `source` (search\|match\|comparison\|direct), `search_query` |
| `search_appearance` | provider in search results | `provider_id`, `search_query`, `page_number` | `filters_applied` (specialty, language, format) |
| `match_appearance` | provider in match results | `provider_id`, `match_score`, `match_rank` | `quiz_answers` (sanitized) |
| `booking_source` | user clicks "Book" | `provider_id`, `source` | `session_duration_seconds` |
| `comparison_add` | provider added to shortlist | `provider_id` | `comparison_count` |
| `booking_completed` | status → `confirmed` | `provider_id`, `booking_id` | `intake_required`, `booking_value` |
| `booking_cancelled` | status → `cancelled` | `provider_id`, `booking_id` | `cancelled_by` (user\|provider\|admin), `reason` |
| `booking_repeat` | confirmed from returning client | `provider_id`, `booking_id` | `previous_bookings_count` |

**Impl**:
```typescript
// src/utilities/analytics.ts
const TRACKING_VERSION = 1

export function trackEvent(event: string, properties: Record<string, any>) {
  posthog.capture(event, {
    ...properties,
    tracking_version: TRACKING_VERSION,
  })
}

// Usage:
trackEvent('profile_view', { provider_id: '123' })
trackEvent('booking_source', { provider_id: '123', source: 'match' })
```

**Client vs server**: Client-side (`profile_view`, `search_appearance`, `comparison_add`) → PostHog browser SDK. Server-side (`booking_completed`, `booking_cancelled`, `booking_repeat`) → PostHog Node SDK in API routes/webhooks (! manipulation).

**PostHog identification**:
- `distinct_id` → user ID (logged-in) | anonymous (visitor). WHO performed action.

**Event properties for provider analytics**:
- `provider_id` → regular property. WHO was acted upon. All provider-profile events ! include. Dashboard queries → filter by `provider_id`.

### Induction mini course
Post-confirmation educational carousel. Walks through first-session expectations. CMS-managed. Ends with congrats. ! first-time bookers OR ! completed within `inductionCourseRepeatMonths` (default 6mo). Tracked via `inductionCompleted` on bookings. ! gates confirmation.

### Booking lifecycle
```
Draft (reserved, 10min)
  → payment → Published (status=pending)
  → intake done (! required) → confirmed
  → induction → inductionCompleted=true
  → session → completed
  → or: cancelled | no-show

Failed:
  → reservedUntil ! → Payload cleanup
  → payment fail → draft unpublished, retry

Cancel:
  → user → cancelled, ! auto-refund
  → provider → request reschedule, booking ! active
  → admin → cancelled, audit trail, last resort
```

## §T Tasks

| id | status | task | cites |
|----|--------|------|-------|
| T1 | x | Homepage: hero, value prop, search CTA, featured providers | V1 |
| T2 | x | Provider search: keyword + filter + pagination, real query | V1, V12 |
| T3 | x | Match quiz: real algorithm (specialties, approaches, languages, format, budget, religion), persist | V4 |
| T4 | x | Match results: top match + alternatives, link profiles | V4 |
| T5 | x | Booking: real provider data, availability from DB + calendar + published bookings | V5, V7, V14 |
| T6 | x | Booking: Stripe payment, failure/retry | V6 |
| T7 | x | Booking: Resend confirmation email + .ics | V10 |
| T8 | x | Provider dashboard: availability CRUD, bookings, Google Calendar sync, OAuth | V14, V7, V21 |
| T9 | x | Reviews: submit, admin moderation, approve/reject | V3, V15 |
| T10 | x | Intake form: post-payment step, soft hints, skip ! required | V11 |
| T11 | x | Induction: CMS carousel, conditional, tracks `inductionCompleted` | — |
| T12 | x | Comparison: real data, shareable URLs, max 4 | V8 |
| T13 | x | SEO: meta tags, sitemap, structured data | V9 |
| T14 | x | i18n: EN/MS switching, locale routing, localStorage | V12 |
| T15 | x | Mobile: audit 320px, fix overflow/touch | V13 |
| T16 | x | Search: global across providers + posts + specialties | V1 |
| T17 | x | PostHog: event tracking setup | — |
| T18 | x | Caching: ISR/revalidate for provider pages | V9 |
| T19 | x | Provider request: submit profile → approval (education, licences, specialties, approaches) | V1, V17 |
| T20 | x | Analytics: Vercel Analytics + Core Web Vitals | — |
| T21 | x | User registration: auto-create during booking (email + name, `client`), magic link | V2, V22 |
| T22 | x | Google Calendar: OAuth 2.0, refresh token, FreeBusy sync, push appointments | V7, V14, V21 |
| T23 | x | Locale: localStorage default, sync DB on account creation | V12 |
| T24 | x | Approaches: m2m + `provider-profiles`, qualification proof per relation | V16 |
| T25 | x | Rename `services` → `specialties`, update references | — |
| T26 | x | Centres: photos, writeup, map, directions, bidirectional roster, booking | — |
| T27 | x | Versioning: Payload `versions: { drafts: true }`, auto-publish non-safety, approval safety | V17 |
| T28 | x | Licences: type, number, issuing body, file upload, expiry; link `provider-profiles` | V17, V19 |
| T29 | x | Provider location: address + coordinates for proximity ranking | — |
| T30 | x | Provider religion: optional filterable field | V18 |
| T31 | x | Licence expiry: emails (30/7/1d), cancel on renewal, hide expired, block bookings, admin notify | V19 |
| T32 | x | Booking lifecycle: draft → published/pending → confirmed → completed/cancelled, Payload cleanup, intake reminders | V6, V20 |
| T33 | x | Global settings: `inductionCourseRepeatMonths` + `slotReservationMinutes` in CMS | — |
| T34 | x | Slot reservation: Payload draft 10min, concurrent check (published + drafts), publish on payment | V20 |
| T35 | x | Auth: magic link, ? password, bcrypt, JWT via Payload | V22 |
| T36 | x | Interests: capture interest for expired-licence providers, re-engagement | V19 |
| T37 | x | Revision cleanup: drafts archived 90d via Payload config | V23 |
| T38 | x | PDPA: privacy policy, consent (granular), logs, export (21d), deletion (30d soft), breach playbook | V24 |
| T39 | x | Health data: explicit consent for intake, encryption at rest | V24 |
| T40 | x | Licence emails: Resend templates (30/7/1d), cancel on renewal | V19 |
| T41 | x | Cancel/refund: user cancel, provider reschedule, admin audit trail, Stripe refund, coupons | V25 |
| T42 | x | Analytics tracking: `src/utilities/analytics.ts`, `TRACKING_VERSION=1`, 8 events, server-side for bookings | V26 |
| T43 | x | Provider dashboard analytics: `/dashboard/analytics`, PostHog Insights API, 7 sections, date filter | V26 |
| T44 | x | Admin dashboard: `/admin/dashboard`, provider overview, "view as", PostHog filtered by `provider_id` | V26 |

## §B Bugs

| id | date | cause | fix |
|----|------|-------|-----|
