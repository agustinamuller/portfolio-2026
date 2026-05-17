---
name: agustina-muller-design
description: Use this skill to generate well-branded interfaces and assets for Agustina Müller's portfolio, either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Key files:
- `README.md` — brand context, content voice, visual foundations, iconography rules
- `colors_and_type.css` — CSS variables for colors, type, spacing, radii, motion. Import this into any new HTML artifact first.
- `assets/` — logos, work images, the signature arrow SVG
- `preview/` — reference cards for colors, type, components
- `ui_kits/portfolio/` — the hi-fi HTML/JSX kit (Components.jsx + Pages.jsx)

When creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create static HTML files that link `colors_and_type.css`. When working on production code, read the rules here and adopt the tokens/components directly.

Signature brand moves — always include at least one:
1. **Mulberry purple accent** `rgb(139,91,135)` on a flat off-white `rgb(250,250,250)` ground — one accent, no gradients.
2. **IM FELL English italic asterisk** `*` paired with Neue Montreal (fallback Inter) display type. The asterisk is the logo-adjacent flourish.
3. **Huge wordmark** hero — 135–190px Neue Montreal Medium, -2% tracking, lowercase.
4. **Pill CTAs** on squared cards — the bimodal radius is the point.
5. **UPPERCASE accent eyebrows** (SERVICES, EXPERIENCE, FINTECH) in purple, sentence-case titles in ink, Spanish long-form body.

If the user invokes this skill without other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
