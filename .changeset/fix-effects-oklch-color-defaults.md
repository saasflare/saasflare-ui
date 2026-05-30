---
"@saasflare/ui": patch
---

Fix invisible/broken default colors across the effects & motion components. Their
defaults wrapped design tokens in `hsl(...)` (e.g. `hsl(var(--primary))`), but the
Saasflare token system is OKLCH — `--primary`, `--chart-1..4`, `--ring`, `--border`
all resolve to full `oklch(...)` colors, so `hsl(oklch(...))` was invalid CSS and
rendered as `none` (transparent). Most visibly, `GradientText` produced invisible
text by default.

Affected components now reference the tokens directly (`var(--primary)`) and use
`color-mix()` for alpha: `GradientText`, `Confetti`, `MouseGradientBlob`,
`ShimmerButton`, `SpotlightCard`, `TracingBeam`, `BorderBeam`, `GlowingEffect`,
`MovingBorder`, `AuroraBackground`, `ParticlesBackground`, `Hotspot`, `RetroGrid`,
`Input`/`Textarea` focus ring, and the animated `beam`/`shiny-text`/`cursor`
variants. No API changes — defaults and JSDoc examples are corrected in place.
