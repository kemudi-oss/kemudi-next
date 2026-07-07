# Kemudi Design Brief

## Register

Brand + Product. Marketing pages use creative-editorial layout (overlapping elements, asymmetric compositions). Product surfaces use grid-disciplined layout (strict columns, predictable alignment). Each screen needs a dominant pattern; never mix registers on one viewport.

## Users

Malaysians seeking mental health support. Feeling lost, overwhelmed, or priced out by existing websites that show up as the top search results. Arriving anxious. Need reassurance before they need information. High-stakes decision (choosing a therapist), so clarity matters more than cleverness.

## Purpose

Navigation and comparison platform for mental health services. Users search, compare, and book therapists. The memorable takeaway: "That they got the help they need and will continue to be supported." Every design decision serves ongoing support, not one-time transaction.

## Voice

Warm older sibling who's been through it. Malaysian English. "You" generous. Reassuring without being patronizing. Empowering (offer choices, never prescriptions). Core value: Clarity is Care. Tone physically: calm hands, steady voice, unhurried pace.

## Anti-References

- Clinical blue/teal hospital aesthetic (ThoughtFull, Skybi, Lyra)
- Corporate SaaS dashboard look
- Purple gradients, 3-column icon grids, centered-everything
- Generic stock-photo hero sections
- Inter/Roboto as primary typeface
- Harsh pure-white backgrounds
- Decorative blobs without purpose
- AI vocabulary in copy

## Design Principles

1. **Liquid Comfort** -- the interface breathes. Organic shapes, warm textures, generous space. Not built; gathered.
2. **Warmth over professionalism** -- every surface says "you're safe here," not "we're certified."
3. **Clarity is care** -- information hierarchy is an act of empathy. Users shouldn't have to think about navigation when they're already anxious.
4. **The long exhale** -- first 3 seconds should feel like relief, not another platform demanding attention.

## Visual Foundation

**Colors (OKLCH space):**
- Primary: Deep Teal `#1F5C5B` (trust, groundedness, primary actions)
- Secondary: Mist Sage `#A8C3B5` (softness, calm, background sections)
- Surface: Warm Sand `#E7D8C9` (cards, inputs, feels like skin/sand)
- Background: Soft Ivory `#FAF7F2` (never pure white)
- Text: Ink Slate `#2B3137` (softer than black)
- Accent: Clay Rose `#C98F8F` (empathy, gentle nudges, used sparingly)
- Muted: `#F5F0EB` (disabled states, muted backgrounds)
- Muted foreground: `#8A8178` (secondary text, placeholders)
- Border: `#E7D8C9` (soft, barely-there)
- Success: `#4A8B6E` | Warning: `#C49A3C` | Error: `#B85450` | Info: `#1F5C5B`
- Dark mode: BG `#1A1917`, Surface `#252320`, Text `#E8E4DF` (desaturate 15-20%)

**Typography:**
- Display: Plus Jakarta Sans Semi-Bold (600), letter-spacing +0.02em
- Body: Noto Sans Regular (400), line-height 1.75, min 16px
- Mentor notes: DM Serif Display Italic (400) -- ONLY for empathetic asides
- Scale: xs(12) sm(14) base(16) lg(18) xl(20) 2xl(24) 3xl(32) 4xl(40) 5xl(56)

**Spacing:** 8px base unit. Comfortable density. Scale: 2(2) 4(4) 8(8) 16(16) 24(24) 32(32) 48(48) 64(64) 96(96)

**Layout:** 12-col desktop, 4-col mobile. Max-width 1200px. Border radius: sm(4) md(8) lg(12) full(9999). Marketing pages: overlapping elements allowed. Functional pages: strict grid, no overlap.

**Motion:** Minimal-functional. Card hover: translateY(-2px) + shadow, 200ms ease-out. Page fade: 250ms ease-out. No parallax, no bounce, no scroll-triggered animations.

**Decoration:** Intentional grain textures on Mist Sage and Warm Sand surfaces. Paper-like quality. No decorative blobs.

## Component Rules

- Built on shadcn/ui + Radix UI primitives
- Tailwind CSS v4 with CSS custom properties
- CVA (class-variance-authority) for variant management
- tailwind-merge + clsx for class composition
- All components must pass 4.5:1 contrast ratio minimum
- Touch targets minimum 44x44px (48x48 comfortable)
- Focus rings: 2-3px, offset, 3:1 contrast, never outline:none without replacement
- Labels always visible (placeholders are not labels)
- Form elements min 1rem on screens under 640px (iOS Safari zoom prevention)

## Accessibility

- WCAG 2.1 AA minimum
- All color combinations tested for deuteranopia, protanopia, tritanopia
- `prefers-reduced-motion` respected with UI slider option
- Focus management for keyboard navigation
- Semantic HTML throughout
- Alt text on all images
- ARIA labels where visual context alone is insufficient
