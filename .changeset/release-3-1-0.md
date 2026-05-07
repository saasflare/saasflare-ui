---
"@saasflare/ui": minor
---

Universal compliance: every visible component now respects `surface`, `radius`, and `animated` from `<SaasflareProvider>` or per-component override.

**What changed.** Per the documented universal contract in `useSaasflareProps`, every Saasflare component must extend `SaasflareComponentProps` and resolve via `useSaasflareProps()`. Before this release, only `Button` did. Now all 55 active-pattern components do — including Card, Dialog, Checkbox, Switch, Tabs, Select, DropdownMenu, all subpath primitives (Calendar, Carousel, Chart, Command, Drawer, InputOTP, Resizable), and all composed SaaS widgets (PricingCard, MetricCard, …).

**Three implementation patterns** (see `packages/ui/docs/component-compliance.md` for the full spec):
- **Pattern A** — Framer-Motion components (Cat 1, 19): hook stack with `useSaasflareMotion` for transition gating.
- **Pattern B** — CSS-motion components (Cat 2, 9): props + data-attrs only; the global CSS layer in `motion.css` zeroes out `animation-duration`/`transition-duration` when `data-animated="false"`.
- **Pattern C** — subset (Cat 3+4+5): only the applicable props are consumed; non-applicable props are accepted at the type level for consistency.

**New helper.** `useSaasflareMotion(animated, base?, ...extraDisablers)` in `motion-config.ts` is the single resolver for component motion. Returns `{ transition, disabled }` where `transition` is the active spring (or `noMotion`) and `disabled` is true when motion should be skipped (provider opt-out, OS reduced-motion, or any extra disabler like `disabled`/`loading`).

**Behavior change** (technically non-breaking, but observable). Components that previously ignored `animated={false}` from `<SaasflareProvider>` now respect it consistently. If you relied on per-component animations running despite a global opt-out, set `animated={true}` per-component explicitly. Same applies to `surface` and `radius` overrides — components now follow provider context where they previously silently used hardcoded defaults.

**Bundle impact.** Main barrel grew from **236 KB raw / 43.4 KB gzip** to **248 KB raw / 44.1 KB gzip** — +509 bytes gzipped across all 55 component refactors. Marginal cost for universal API consistency.

**Sheet reclassified** from Cat 1 to Cat 2 in the doc — it uses pure CSS animations, not Framer Motion. No functional change.
