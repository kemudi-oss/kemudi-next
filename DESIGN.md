# Design System — Kemudi

## Product Context
- **What this is:** A mental health navigation and comparison platform for Malaysians seeking therapy. Turns overwhelming complexity into a clear, human, supportive journey.
- **Who it's for:** Malaysians who feel lost, overwhelmed, or priced out by existing clinical directories.
- **Space/industry:** Health-tech / mental health services marketplace. Peers: ThoughtFull World, Skybi, MIASA, Lyra Health, Talkspace.
- **Project type:** CMS-powered marketing/content platform with planned marketplace features (provider search, comparison, booking).

## Aesthetic Direction
- **Direction:** Organic/Natural ("Liquid Comfort")
- **Decoration level:** Intentional -- subtle grain textures on surfaces, like a well-loved notebook
- **Mood:** The interface should feel like a long exhale. Not a medical office, not a SaaS dashboard. A calm room where someone's already been thinking about you. "The warm older sibling who's already been through it."
- **Reference sites:** ThoughtFull World (Malaysia), Skybi (Malaysia), Lyra Health (US), Talkspace (US)
- **Departure rationale:** Every mental health platform in Malaysia and globally uses blue/teal/clinical aesthetics. They all look interchangeable -- professional but generic. Kemudi's warm palette and organic texture say "you're safe here" instead of "we're professional."

## Typography
- **Display/Hero:** Plus Jakarta Sans Semi-Bold (600), letter-spacing +0.02em -- grounded, modern, calm voice. Serves the "warm older sibling" personality.
- **Body:** Noto Sans Regular (400), line-height 1.75 -- massive breathing room for complex mental health information. Minimum 16px.
- **"Mentor Notes":** DM Serif Display Italic (400) -- used ONLY for empathetic asides (e.g., "Not sure where to start? It's okay to feel this way."). Breaks sans-serif monotony. Feels like a friend wrote it in the margins of your screen.
- **UI/Labels:** Same as body (Noto Sans)
- **Data/Tables:** Noto Sans with tabular-nums
- **Code:** Geist Mono
- **Loading:** Google Fonts -- Plus Jakarta Sans, Noto Sans, DM Serif Display
- **Scale:**
  - xs: 0.75rem (12px) -- captions, fine print
  - sm: 0.875rem (14px) -- labels, secondary text
  - base: 1rem (16px) -- body text
  - lg: 1.125rem (18px) -- large body, lead paragraphs
  - xl: 1.25rem (20px) -- subheadings
  - 2xl: 1.5rem (24px) -- section headings
  - 3xl: 2rem (32px) -- page headings
  - 4xl: 2.5rem (40px) -- hero headings (mobile)
  - 5xl: 3.5rem (56px) -- hero headings (desktop)

## Color
- **Approach:** Restrained + warm. Color is rare and meaningful. Every color choice serves the "calm home" feeling.
- **Primary (Deep Teal):** `#1F5C5B` -- Trust, groundedness. Used for primary actions, links, key interactive elements.
- **Primary Foreground:** `#FAF7F2` -- Text on primary surfaces.
- **Secondary (Mist Sage):** `#A8C3B5` -- Softness, calm. Used for large background sections, secondary surfaces.
- **Surface (Warm Sand):** `#E7D8C9` -- Cards, inputs, form elements. Feels like skin or sand. Reduces clinical coldness.
- **Background (Soft Ivory):** `#FAF7F2` -- Main page background. Never pure white -- too harsh for this audience.
- **Text (Ink Slate):** `#2B3137` -- Primary text. Softer than pure black, more readable at length.
- **Accent (Clay Rose):** `#C98F8F` -- Gentle nudges, soft alerts, "empathy" color. Feels like a human pulse. Used sparingly.
- **Muted:** `#F5F0EB` -- Muted backgrounds, disabled states. Warm gray.
- **Muted Foreground:** `#8A8178` -- Secondary text, placeholders.
- **Border:** `#E7D8C9` (same as Warm Sand) -- Soft, barely-there borders.
- **Semantic:**
  - Success: `#4A8B6E` -- Calm green, not neon
  - Warning: `#C49A3C` -- Warm amber
  - Error: `#B85450` -- Muted red, not alarming
  - Info: `#1F5C5B` -- Deep Teal (same as primary)
- **Dark mode:** Reduce saturation 15-20%, deepen surfaces. Background: `#1A1917`, Surface: `#252320`, Text: `#E8E4DF`. Keep Warm Sand and Mist Sage as accent tones but desaturated.

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable -- this isn't a data-dense dashboard. People need room to think.
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64) 4xl(96)

## Layout
- **Approach:** Hybrid -- grid-disciplined for search/provider cards/booking (clarity when making decisions), creative-editorial for marketing pages (asymmetric compositions, overlapping elements).
- **Grid:** 12-column on desktop, 4-column on mobile. Content max-width: 1200px.
- **Marketing pages:** Allow overlapping elements (Warm Sand card slightly overlapping Mist Sage background blob, Clay Rose circle peeking from behind image). "Human error" in alignment makes it feel curated, not built.
- **Functional pages (search, booking, forms):** Strict grid. No overlap. Users need clarity when making decisions.
- **Border radius:** sm: 4px (small elements), md: 8px (cards, inputs), lg: 12px (large containers), full: 9999px (avatars, badges). 12-16px rounded corners as specified in requirements.

## Motion
- **Approach:** Minimal-functional -- only transitions that aid comprehension
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(50-100ms) short(150-250ms) medium(250-400ms)
- **Patterns:**
  - Card hover: subtle lift (translateY -2px) + shadow deepening, 200ms ease-out
  - Page transitions: fade in, 250ms ease-out
  - Form state changes: color transition, 150ms ease-in-out
  - No scroll-triggered animations. No parallax. No bouncing elements.
  - The UI breathes, it doesn't dance.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-07-07 | Initial design system created | Created by /design-consultation. Based on competitive research (5 platforms), Claude subagent "Liquid Comfort" direction, and memorable thing: "That they got the help they need and will continue to be supported." |
| 2026-07-07 | Warm organic palette over clinical blue | Every mental health platform uses blue/teal. Kemudi's Warm Sand + Mist Sage palette is the only one that says "calm home" instead of "medical office." |
| 2026-07-07 | DM Serif Italic for mentor notes only | Used exclusively for empathetic asides. Breaks sans-serif monotony at emotional moments. Feels like a friend writing in the margins. |
| 2026-07-07 | Hybrid layout (grid + editorial) | Strict grid for search/booking (clarity), overlapping elements on marketing pages (human, curated feel). |
| 2026-07-07 | Intentional decoration (grain textures) | Paper-like texture on surfaces removes "clinical sheen." Says "someone made this with care." |
