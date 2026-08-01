---
"@saasflare/ui": minor
---

Export five components that shipped in the package but were unreachable: `AnimatedBeam`, `AnimatedCounter`, `AnimatedCursor`, `AnimatedShinyText`, and `AnimatedTestimonials`. All five were complete, documented, and bundled into `dist` — they were simply missing from `src/components/ui/index.ts`, so `import { AnimatedCounter } from "@saasflare/ui"` failed to type-check for every consumer.

Also removes `animated/aurora-background.tsx`, a dead duplicate of the exported `AuroraBackground` that was never imported and would have collided on name.
