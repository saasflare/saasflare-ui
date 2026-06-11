---
"@saasflare/ui": minor
---

Bundleless (per-module) dist — the structural fix behind the bundle-perf findings.

Every source file now compiles to its own dist module (490 files) instead of one bundled mega-entry per format. All public entry paths (`dist/index.*`, `dist/entries/*`) are unchanged; consumer imports stay identical. What changes:

- **RSC granularity:** the `"use client"` directive is injected per module — 226 modules ship server-eligible (was 6 chunks), including `cn`, `PALETTES`, and the type/constant modules. The main barrel itself carries no directive anymore. `createSafeContext` moved from `lib/utils` into its own client module so the pure utilities stay server-safe.
- **Tree-shaking:** consumer bundlers prune per module. A `cn`-only import dropped from ~131 KB to ~26 KB even without `sideEffects` hints, and to near-zero in bundlers that honor the package's `sideEffects` field.
- **Peer confinement:** `react-hook-form` is referenced only by `form.*` and `react-day-picker` only by `calendar.*` — no longer baked into the shared entry chunk. (They remain required peers for now: CJS `require` of the barrel and Vite dep-prebundling still resolve the full graph.)
- Declarations now come from `tsc` (per-file, matching the module layout) instead of rollup-dts.

Validated: every relative specifier in dist resolves (1,420 checked), CJS barrel loads 455 exports, package + app typecheck clean, and a full Next production build of the catalog (141 pages) passes against the new dist.
