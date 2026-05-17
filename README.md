# Agustina Müller — Portfolio Design System

A personal portfolio design system for **Agustina Müller**, a UX/UI & Product Designer from Argentina.

The portfolio presents her work across mobile apps, web platforms, design systems and SaaS products (B2B & B2C, Fintech, E-commerce). Copy is bilingual: English UI + Spanish long-form descriptions. The visual language is minimal editorial-Swiss — very large wordmark, generous neutrals, pill-shaped buttons, and a single mulberry-purple accent color paired with decorative italic asterisks set in **IM FELL English**.

## Sources

- **Figma file:** `portfolio.fig` (mounted virtually as `/Portfolio` and `/UI-Kit` pages)
  - `/Portfolio/HOME` — desktop + mobile home page (primary reference)
  - `/Portfolio/WORK` — work detail page
  - `/Portfolio/Components` — component specimen sheet
  - `/UI-Kit/Typography` — typescale and font definitions
  - `/UI-Kit/Components` — component library
  - `/UI-Kit/Moodboard`, `/UI-Kit/Moodboard-WEB` — moodboards

## Products represented

There is **one product**: the portfolio website itself (desktop + mobile responsive). The site is the design system; every component is in service of showcasing work.

## Index

| File | Purpose |
|---|---|
| `README.md` | You are here |
| `SKILL.md` | Agent-invocable skill wrapper |
| `colors_and_type.css` | CSS variables — color, type, space, radii, motion |
| `assets/` | Logos, illustrations, placeholder work images, icons |
| `fonts/` | Webfonts (IM FELL English from Google Fonts; Neue Montreal noted below) |
| `preview/` | Design-system tab cards — colors, type, components, etc. |
| `ui_kits/portfolio/` | Hi-fi UI kit — home, work list, contact, components |

## Font substitution note

**Neue Montreal** (the primary typeface — 500+ instances in the file) is a commercial Pangram Pangram font. It is **not freely licensed**, so we fall back to **Inter** (neo-grotesque, tight tracking, similar x-height) in `colors_and_type.css`. If you own a Neue Montreal license, drop the `.woff2` into `fonts/` and add a local `@font-face` — the rest of the system will pick it up via `--font-sans`.

**IM FELL English** is on Google Fonts and loaded directly.

---

## CONTENT FUNDAMENTALS

**Language:** Bilingual — **English for navigation and section titles, Spanish for long-form project descriptions.** The site is Argentinian-authored but targets an international audience, so UI chrome is English.

**Voice:** First-person, quietly confident. Results-forward — project titles lead with verbs of impact in past-tense Spanish ("**Aumenté la conversión…**" / *"I increased conversion…"*). No buzzwords, no hype, no emoji.

**Tone:** Warm-professional. "let's talk!" (lowercase, with exclamation) sits next to formal copyright. The asterisks (`*`) set in italic serif are the only flourish — they signal "handmade portfolio, not corporate template."

**Casing:** 
- **Lowercase for name + navigation:** `agustina müller`, `work`, `about me`, `let's talk`
- **Sentence case for titles:** "Explore my work", "Let's talk!"
- **UPPERCASE for eyebrows/categories** in purple accent: `SERVICES`, `EXPERIENCE`, `INDUSTRY`, `AVAILABILITY`, `YEAR`, `TAG`

**Pronouns:** First-person ("Diseño…", "Explore my work"). Never "we" — this is a solo portfolio.

**Emoji:** None. The italic serif `*` is the one decorative glyph.

**Sample copy (from the file):**
- Hero description: *"UX/UI & Product Designer de Argentina. Diseño aplicaciones mobile y plataformas web, conectando necesidades de usuario con objetivos de negocio, con foco en design systems y productos escalables."*
- Project title: *"Aumenté la conversión en una experiencia de escaneo facial 3D"*
- Project description: *"Diseño de una app B2C para la compra de lentes personalizados, combinando escaneo facial 3D, datos biométricos y gestión de prescripciones médicas en un flujo simple y guiado."*
- CTAs: `let's talk`, `about me`, `work`, `ver proyecto`
- Footer: `Let's talk!` → `magustinamuller@gmail.com` → `Agustina Müller © 2025`

---

## VISUAL FOUNDATIONS

**Overall vibe:** Editorial Swiss minimalism with a whisper of warmth from the serif asterisks. Flat, quiet, type-led. Layouts breathe — 112px horizontal page gutters on desktop.

**Colors:**
- **Ground:** warm off-white `rgb(250,250,250)` — not pure white
- **Ink:** near-black `rgb(19,19,22)` for headings, `rgb(39,39,43)` for body, `rgb(87,88,96)` for copyright/captions
- **Accent:** a single mulberry purple `rgb(139,91,135)` used for eyebrows, buttons, the asterisk and category tags. No gradients.
- **Borders:** `rgb(173,173,184)` hairlines
- **Image placeholder:** `rgb(224,224,224)` flat gray

**Type:**
- **Neue Montreal Medium** at display scales (190px hero, 135px "Explore my work", 64px footer)
- **Neue Montreal Regular** for body at 16/14px, 28px line-height
- **IM FELL English Italic** for the signature `*` glyph — serif, slightly rough, 24px inline / 82px in the hero illustration group
- Letter-spacing is tight (-2%) at all display sizes. Body is neutral (0).

**Spacing:** 8pt baseline (8, 16, 24, 32, 48, 56, 72, 96, 112). Sections use 56px top padding and 48–56px bottom padding. Page container is 1280px wide on desktop, 393px on mobile.

**Backgrounds:** Flat off-white. **No gradients, no textures, no grain, no hand-drawn patterns.** Full-bleed photography is used exclusively inside project cards — never as a page background.

**Animation:** Restrained. Button hover swaps to outlined (border appears, fill clears). Fades on scroll are the expected pattern. No bounces, no parallax, no oversized motion. Ease with `cubic-bezier(0.2, 0.8, 0.2, 1)` at ~220ms.

**Hover / press states:**
- **Ghost nav button →** hover gets the same text in slightly muted ink, no underline
- **Primary "let's talk" →** default = mulberry fill, white text, arrow; hover = outlined (transparent fill, 1px ink border, ink text/arrow)
- **Links & text →** `opacity: 0.7` on hover
- **Cards →** no lift/shadow change; subtle opacity on image or arrow translate-x

**Borders:** Almost always 1px hairlines. Tag chips use a square border (`1px solid rgb(173,173,184)`) — **not rounded** despite the pill-button language elsewhere. This intentional dissonance is part of the editorial feel.

**Shadows:** Essentially none. The design is flat. If used at all, very soft `0 4px 12px rgba(0,0,0,0.06)`.

**Transparency / blur:** Not used. Everything is opaque and flat.

**Corner radii:** A bimodal system:
- **Pill (100px)** — all buttons, tags marked as pills, section-work rounded outer frame (100px radius on the section)
- **Square (0–2px)** — cards, images, input fields, category tag chips

**Cards:** Off-white background, no shadow, no rounded corners on image (or very slight). Image fills the top; content (year, tags, title, description, CTA) sits below in a single row — year/tags left, CTA right.

**Layout rules:**
- Page max-width: 1280px (desktop) / 393px (mobile)
- Horizontal page gutters: 112px desktop / 16px mobile
- Nav is fixed-height 96px (28px vertical padding)
- Hero is centered, all text center-aligned
- Work cards are left-aligned, full container width

**Imagery tone:** Warm, editorial, photographic — product shots on soft gradients, not cool or B&W. JPEGs of smart glasses, lifestyle imagery. Placeholder imagery is flat `rgb(224,224,224)` — a designer's ∅-set, not a noisy skeleton.

---

## ICONOGRAPHY

**Approach:** Extremely minimal. The portfolio uses exactly three iconographic elements:

1. **Arrow icon** — a simple 16px / 20px / 14px line arrow pointing up-right, color-matched to the button label (white on the purple primary, ink on the ghost). Copied from Figma into `assets/arrow-icon.svg`.
2. **Hamburger / close / search icons** — thin 2px-stroke, 32px bounding box, near-black or purple when active. Lucide matches these stroke weights closely.
3. **IM FELL English italic asterisk (`*`)** — not an icon per se, but *functions* as one. It appears as a serif glyph throughout: inside category pills before "Product design", in the hero illustration group, beside logos, as a marker. This is the signature flourish of the brand.

**Icon library:** No custom icon font. No sprite. Just the arrow SVG + a couple of inline chrome SVGs (hamburger, search). For any missing icons we substitute **Lucide** (`https://unpkg.com/lucide@latest`) — 2px stroke, round caps, which matches the existing weight. Flag the substitution in the UI kit where used.

**Emoji:** None, ever.

**Unicode as icon:** Only the `*` (U+002A) is stylized via the IM FELL English serif family. Other Unicode glyphs are not used as iconography.

**Logos:** The wordmark itself is the logo — "agustina müller" set in Neue Montreal Medium, lowercase, 20px, ink-colored. At hero scale it becomes the 190px centerpiece. No monogram, no icon-mark variant.

---

See `preview/` for the registered design-system cards and `ui_kits/portfolio/` for the high-fidelity recreation.
