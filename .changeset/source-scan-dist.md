---
"@saasflare/ui": patch
---

**Fixes component styling being silently dropped in every consumer app.**

`styles/theme.css` declared its Tailwind v4 source scan as `@source "../src/components"`, but `package.json` publishes `files: ["dist", "styles", "fonts"]` — `src/` never reaches an installed copy of the package. In any consumer the directive matched nothing, so Tailwind generated no utilities for classes used *inside* Saasflare components. Anything the consuming app did not also happen to use in its own code was simply missing.

The visible symptoms were components that render as unstyled blocks: `GradientText` and `AnimatedShinyText` painted a solid rectangle instead of gradient-filled text (`bg-clip-text` was never generated), and a long tail of spacing, animation, and state utilities went missing wherever a component was the only user of them.

The bug was invisible in this monorepo, where `src/` exists — which is exactly why it shipped. `@source` now points at `dist`, which is published and where tsup preserves the class strings verbatim, so both contexts generate the same utility set. `apps/ui` adds its own `@source` for `src` so package development still hot-reloads.

Also fixes `AnimatedShinyText` rendering as a single moving sliver of text. It set `text-transparent` alongside a gradient built from `currentColor` — but `text-transparent` *is* `color: transparent`, so `currentColor` resolved to transparent and only the narrow shimmer band was ever visible. The glyph fill is now made see-through with `-webkit-text-fill-color` alone, leaving `color` intact for `currentColor` to resolve against.

And drops the `will-change` React state in `BlurFade`: it re-rendered the component twice per entrance to toggle a class that arrives too late to help the compositor anyway. The hint is now written directly to the node.
