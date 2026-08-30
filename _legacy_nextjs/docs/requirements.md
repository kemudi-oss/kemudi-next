# Kemudi — Product Requirements v0.2.2

## 1. Product Overview
**The Pitch:** A trusted navigation and comparison platform for mental health services in Malaysia. Kemudi turns the overwhelming complexity of finding therapy into a clear, human, and supportive journey. We act as the "warm older sibling," helping users make confident, informed choices about their care.

**Target Audience:** Malaysians seeking mental health support who feel lost, overwhelmed, or priced out by existing clinical directories.
**Brand Personality:** Calm, knowledgeable, warm, and grounded.

---

## 2. Brand Strategy & Tone
**Core Value:** **Clarity is Care.** Every interaction should reduce jargon and increase understanding.
**Tone of Voice:**
- **Warm & Reassuring:** "Finding the right support shouldn't feel like another thing to figure out alone."
- **Malaysian English:** Natural, local, and grounded. Use "you" generously.
- **Empowering:** Offer choices, never prescriptions. "Take your time. I'm here when you're ready."

---

## 3. Visual Identity (Kemudi Design System)
**Color Palette:**
- **Deep Teal:** `#1F5C5B` (Primary - Trust & Groundedness)
- **Mist Sage:** `#A8C3B5` (Secondary - Softness & Calm)
- **Warm Sand:** `#E7D8C9` (Surfaces - Reducing clinical coldness)
- **Soft Ivory:** `#FAF7F2` (Main Background)
- **Ink Slate:** `#2B3137` (Primary Text)
- **Clay Rose:** `#C98F8F` (Warm Accents/Highlights)

**Typography:**
- **Headings:** `Plus Jakarta Sans`, Semi-bold, generous letter-spacing.
- **Body:** `Noto Sans`, Regular, 1.6–1.7 line height (Min 16px).
- **Accents:** `DM Serif Display`, Italic (for quotes or gentle highlights).

**UI Patterns:**
- **Shapes:** 12–16px rounded corners; organic blob shapes as background accents.
- **Shadows:** Soft, diffused shadows instead of harsh borders.
- **Imagery:** Minimal line art illustrations or photography of diverse Malaysians in calm, natural settings.

---

## 4. Key Architecture Decisions

### 4.1 System Architecture
- **Next.js frontend with App Router**
- **Payload CMS as the content management dashboard, utilising native Payload CMS to manage the whole platform as much as possible**
- **Vercel deployment with optimized caching**

### 4.2 Database Schema (PostgreSQL via Neon)
- **Comprehensive relational design for providers, services, and user profiles, bookings, payments**
- **Optimized indexes for provider search performance**
- **Support for multilingual content and user preferences**
- **Request and approval system for new providers to be listed**
- **Review and rating system with moderation**

### 4.3 Frontend Architecture
- **shadcn/ui component library with Radix UI primitives for accessibility**
- **Tailwindcss latest version with Kemudi branding colors, fonts etc.**
- **Payload multilingual support (English, Malay; Chinese and Tamil as future provision)**
- **Responsive design with mobile-first approach**

### 4.4 Technical Implementation
- **Server-side rendering for SEO and performance**

---

## 5. Technical Specifications

| Layer | Technologies |
|-------|--------------|
| **Backend** | Payload CMS v3 latest version, Vercel Blob |
| **Frontend** | Next.js latest compatible version with Payload (App Router), TypeScript latest version, React latest compatible version with Next.js, Tailwind CSS latest version, shadcn/ui latest version using Radix UI primitives (custom Kemudi color scheme and branding) |
| **Database** | PostgreSQL database |
| **Infrastructure** | Vercel (Frontend, CDN), Neon (Database), Vercel Blob (File Storage), Resend (Transactional emails) |
| **Observability** | Vercel Analytics, PostHog (Product analytics) |

---

## 6. Core User Journeys

### 6.1 Discovery Journey
User arrives → Sees warm welcome → Enter search keywords in search field → Browses providers in search results, with option to view full provider profiles and see their respective ratings and reviews → (Optional) [Comparison journey] → [Booking journey]

### 6.2 Comparison Journey
User adds/removes providers to/from shortlist for comparison → Views side-by-side comparison of shortlisted provider profiles → (Optional) Shares URL to the side-by-side comparison of shortlisted providers profile

### 6.3 Booking Journey
User selects provider to book appointment with → Views provider's availability → Selects preferred date and time slot for appointment → Books appointment → Makes payment → Receives confirmation and calendar invitation → (If therapist has configured compulsory intake form) Fills up pre-appointment intake form → Completes carousel-like induction mini course → Sees congrats message on readiness for upcoming appointment

### 6.4 Therapist Matching Journey
User opens therapist matching quiz → Answers several questions → Sees one best match therapist → Views best match therapist profile → (Optional) Views the next best matches in listing, with option to view full therapist profiles and see their respective ratings and reviews → (Optional) [Comparison journey] → [Booking journey]
