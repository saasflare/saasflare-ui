# @saasflare/ui

## 1.1.0

### Minor Changes

- **Switch from `framer-motion` to `motion` (the library's new package name) and drop the `tw-animate-css` runtime dependency.**

  Breaking-ish for installers — read below before upgrading.

  ### Animation peer changed: `framer-motion` → `motion`

  The Motion team renamed the npm package from `framer-motion` to `motion` (same maintainers, same code, identical API surface, exposed under `motion/react`). All 40 internal imports were swapped from `from "framer-motion"` to `from "motion/react"`. No runtime behavior changes.

  If you had `framer-motion` installed for `@saasflare/ui`, install `motion` instead:

  ```bash
  pnpm add motion
  pnpm remove framer-motion
  ```

  `motion` is now declared as an **optional** peer (`peerDependenciesMeta.motion.optional = true`) — components that don't animate work without it.

  ### `tw-animate-css` no longer a runtime dependency

  The handful of utilities we actually use (`animate-in`/`animate-out`, `fade-*`, `zoom-*`, `slide-*` on cardinal axes, plus `accordion-down`/`accordion-up` and `caret-blink` keyframes) are now vendored directly into `packages/ui/styles/motion.css` as Tailwind v4 `@utility` blueprints. The `@import "tw-animate-css"` in `theme.css` is gone, and the package is dropped from `dependencies`.

  Consumer-visible effect: one less transitive npm install. No CSS class name changes.

  ### `next` and `next-themes` peer adjustments

  - `next` peer range loosened from `^16.0.0` to `^15.0.0 || ^16.0.0`.
  - `next` and `next-themes` are now **optional** peers — only required if you actually import the components that use them (`<TopLoadingBar>`, `<Logo>`, `<AnimatedTooltip>`, `<ThemeModeToggle>`, `<Sonner>`, the `SaasflareProvider` theme bridge).

## 1.0.2

### Patch Changes

- Move `react`, `react-dom`, `next`, and `next-themes` out of `devDependencies`. They are already declared as `peerDependencies`, so duplicating them in `devDependencies` risked dual-React installs in consumer trees (the classic "Invalid hook call" symptom) and gave no benefit beyond what pnpm's `auto-install-peers` already provides.

  No runtime change for consumers. `@types/react` / `@types/react-dom` stay in `devDependencies` since they are type-only and needed for the local build.

## 1.0.1

### Patch Changes

- c574cfc: Bundle hygiene, subpath split, and LazyMotion adoption.

  - Split heavy dependencies into dedicated subpath entries (`@saasflare/ui/chart`, `@saasflare/ui/carousel`) so the root entry stays lean.
  - Adopt Framer Motion `LazyMotion` (strict mode) inside `SaasflareShell` to defer animation feature loading until needed.
  - Tighten the published `exports` map and `files` allowlist; trim transitive surface area for downstream consumers.
