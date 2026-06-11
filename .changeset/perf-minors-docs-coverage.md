---
"@saasflare/ui": patch
---

Runtime-perf cleanups (verified review minors) + full catalog coverage.

- **SpotlightCard / GlowingEffect**: cursor tracking moved out of React state — position is written as CSS variables directly on the overlay (no per-frame re-render), and the container rect is cached for the hover duration instead of a forced-layout `getBoundingClientRect` per mousemove (invalidated on enter/scroll/resize).
- **MouseGradientBlob**: same rect caching in the mousemove hot path.
- **DockItem**: item centers are cached instead of reading `getBoundingClientRect` for every item on every mouseX update while the width spring writes layout per frame (the classic read/write thrash interleave).
- **ScrollToTopButton**: the scroll-container resolver gives up after ~10s with a dev warning instead of polling `getElementById` every frame forever when the id never mounts.
- **Docs**: `Logo` and `AppIcon` join the catalog (registry, props, doc pages, demos) — the generated docs now cover all 130 public components.
