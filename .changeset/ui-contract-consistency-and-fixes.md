---
"@saasflare/ui": minor
---

Make the `SaasflareComponentProps` contract consistent across the catalog, fix verified correctness bugs, and clean up quality issues. Additive — no public API removed or renamed.

**Contract consistency** — every visibly-rendering component now extends `SaasflareComponentProps` and resolves `surface` / `radius` / `animated` / `iconWeight` via `useSaasflareProps`, emitting the `data-surface` / `data-radius` / `data-animated` attributes (coverage went from ~91 to 131 files). Concretely this fixes three systemic gaps:

- **Motion kill-switch** — ~15 JS-motion components (e.g. `HeroVideoDialog`, `Dock`, `Timeline`, `GalleryLightbox`, `AnimatedTooltip`, `BentoGridItem`) gated only on `useReducedMotion()` and silently ignored `animated={false}`; they now honor it via `useSaasflareMotion`.
- **`data-animated` emission** — CSS-motion components (`Toggle`, `Avatar`, `Sheet`, `StatCard`, `TeamCard`, `TestimonialCard`, `TagInput`, `FeatureCard`, …) now emit the attribute so the per-component motion gate actually engages.
- **Off-contract primitives** — `Separator`, `Label`, `Kbd`, `Item`, `ButtonGroup`, `GradientText`, and others now accept the standard axes.

**Correctness fixes (44 verified)** — including 3 `Math.random()` SSR-hydration bugs replaced with `useId()` (sidebar skeleton, `Rating` clip-path, animated `beam` gradient), `CommandDialog` a11y nesting, `AppIcon` dropping its ref/props, `Form` hook-order, `MouseGradientBlob` global selector, animated `cursor` listener leak, and missing `"use client"` on `StatCard` / `TeamCard` / `Empty` / `FeatureCard` (RSC crash).

**Quality** — replaced hardcoded colors with design tokens (brand colors preserved), swapped reimplemented inline `<svg>` icons for Phosphor icons that honor `iconWeight` (e.g. `Steps` checkmark), removed 3 empty stub files, and corrected stale `@module` / "Framer Motion" doc labels. Also fixed the `social-button` registry description, which incorrectly advertised 16 providers (it supports 5; the 16-provider component is `SocialAuthButton`).

**Documentation** — the docs catalog + shadcn registry now also cover 9 previously-undocumented public exports (`Sidebar` system, `SocialAuthButton`, `StatefulButton`, `ThemeModeToggle`, `ThemeModeMultiToggle`, `UserAvatar`, `TopLoadingBar`, `ScrollToTopButton`, `AnimatedTooltip`), so every shipped export now has a props table, demos, and an installable registry block.
