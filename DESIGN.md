# Xhibit design system

**Concept — "The Gallery."** Xhibit means *exhibit*. The site is a calm, well-lit gallery and every business is an exhibit on display. Here's what follows from that:
- generous space
- a framed hero
- museum labels ("No. 03 — How it works", "Exhibit 04 — Salons")
- devices presented like objects on plinths
- one standout moment: the hero silk

Tagline: *Your business, beautifully on display.*

## Colour

The palette is drawn from Jharkhand's Sohrai/Khovar wall art and red earth, kept restrained. Tokens live in `src/index.css` (`@theme`).

| Token | Hex | Use |
|---|---|---|
| `ivory` | `#fbf7f0` | page background |
| `linen` | `#fffdf9` | cards |
| `sand` | `#f3ebdf` | alternate sections, chips |
| `ink` | `#1d1a16` | text, primary buttons |
| `ink-soft` | `#5c544b` | secondary text (6.9:1 on ivory) |
| `clay` / `clay-deep` | `#c4532d` / `#a33f1e` | brand accent; `clay-deep` for small text |
| `ochre` | `#e9a23b` | highlights on dark |
| `sal` | `#2e4b3c` | success, ticks |
| `dusk` | `#17152a` | dark sections (AI, footer) |
| `wa` | `#25d366` | WhatsApp buttons only |

Each industry has its own `theme` in `src/content/industries.ts`:
- **`tint`:** the soft page wash.
- **`deep`:** the curtain and accents.
- **`silk`:** four colours the hero silk flows through.

## Type

- **Display:** Fraunces (variable, optical sizes). Weight ~380 for headings; italic for emphasis, written as `*word*` in `RevealHeading`.
- **Body/UI:** Plus Jakarta Sans. Body is 17px; never use tiny grey text.
- **Scale:** fluid. `text-hero` (capped at 11% of screen height), `text-display`, `text-title`, `text-lead`, `eyebrow`.
- **Demos** load their own fonts lazily: DM Serif/DM Sans, Manrope + Mukta (Hindi), Lexend, Cormorant + Jost, Anton + Inter, Marcellus, Bodoni Moda. Headings inside `.demo-root` inherit the demo's font, not the site's.

## Shape & depth

- **Radius:** 28px cards (inset sections 28 / 36 / 44px by breakpoint); fully round buttons.
- **Shadows:** warm-tinted only (`shadow-soft`, `shadow-lift`, `shadow-device`), never grey.
- **Grain:** the `grain` / `grain-light` classes add a faint paper texture to framed panels.

## Motion

- **Feel:** calm confidence. Entrances use `cubic-bezier(.22,1,.36,1)`; curtains use `(.76,0,.24,1)`; touch feedback uses springs.
- **Durations:** 150–250ms micro, ~0.9s reveals, about 1.4s for a full route change.
- **Signature moments:**
  1. The hero silk, rotating word and phone change together.
  2. The page curtain in the destination's colour.
  3. A typed name appears everywhere instantly.
  4. Phone → big-screen demo.
  5. The AI chat that types back.
  6. The scroll-drawn process line.
- **Reduced motion:** `MotionConfig reducedMotion="user"`, no WebGL, static gradient, no marquee or rotation.
- **Smooth scrolling:** Lenis on mouse/trackpad only. Phones keep native scrolling.

## Building blocks

| Component | Where |
|---|---|
| `Button`, `ButtonLink`, `ButtonRoute` | `components/ui/Button.tsx` — primary/secondary/light/whatsapp variants |
| `RevealHeading`, `Reveal`, `RevealGroup` | scroll reveals (`*word*` = italic accent) |
| `Eyebrow` | museum label with optional "No. 0X" |
| `Marquee`, `Accordion`, `Magnetic` | — |
| `DemoDevice` | live demo in a phone or browser frame (`components/device`) |
| `TLink` / `usePageTransition().go()` | internal links with the curtain |
| `waHref(waMessage({...}))` | context-aware WhatsApp links |

## Adding a new industry demo

1. Add its data to `src/content/industry-meta.ts` (slug, SEO) and `src/content/industries.ts` (copy, theme, features, FAQs).
2. Create `src/demos/<name>/<Name>Site.tsx`:
   - Use `DemoProps` (`name`, `area`).
   - Mark sections with `data-section="…"` (the feature tour scrolls to these).
   - Use `@3xl:` container-query classes for the desktop layout.
3. Register it in `src/demos/registry.ts` (loader + status-bar colour).
4. Add photos to `scripts/demo-images.json` and run `npm run images`, then `npm run og`.
