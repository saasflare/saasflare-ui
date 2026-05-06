# @saasflare/ui

## 1.1.2

### Patch Changes

- Add TypeScript 6 support. Bumps `typescript` devDep from `^5.9.3` to `^6.0.3`. Affects how the package is developed and how `.d.ts` files are emitted; consumer-visible only via the (unchanged) `.d.ts` output, which still typechecks under TS 5 and TS 6.

  Configuration adjustments to satisfy TS 6's stricter deprecation rules:

  - Removed `baseUrl` from `tsconfig.base.json` and `apps/ui/tsconfig.json`. It was only there as boilerplate; nothing in the workspace relied on bare-path resolution. `apps/ui`'s `paths: { "@/*": ["./*"] }` now resolves relative to the tsconfig file, which TypeScript 5.4+ supports natively.
  - Added `ignoreDeprecations: "6.0"` to `tsconfig.base.json`. This is a workaround for [tsup 8.5.1's DTS bundler](https://github.com/egoist/tsup/blob/main/src/rollup.ts), which hard-codes `baseUrl: compilerOptions.baseUrl || "."` when synthesizing the DTS rollup config. The injected default trips TS 6's deprecation error even though our own configs are clean. Once tsup releases a fix, this opt-out can be dropped.

  Verified: `packages/ui` typecheck + tsup build (CJS, ESM, DTS) green; `apps/ui` typecheck + full Next 16 production build green.

## 1.1.1

### Patch Changes

- Bump `lucide-react` floor from `^0.577.0` to `^1.14.0`. Lucide cut its `1.0` stability release in March 2026; the API surface and React peer range are unchanged. Verified by `pnpm -F @saasflare/ui typecheck` + `build` and `pnpm -F @saasflare/demo-ui typecheck` against all 34 internal icon imports.

  If a consumer previously installed `lucide-react` directly with a `^0.x` range, they should align to `^1.x` to avoid duplicate copies in their tree.

  No other dependency or peer range changes — every other package stays in its existing caret range, and the resolved versions on `pnpm install` are already current.

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
