# @saasflare/ui

## 3.0.2

### Patch Changes

- 08e9a06: Internal cleanup: shorten 104 deep relative imports of `cn` and friends. Components now import from `../../lib` (the package barrel) instead of the deep `../../lib/utils` path. WebStorm's "Import can be shortened" hint no longer fires across the codebase.

  No behavior or API change. Bundle size identical (236 KB raw / 43 KB gzip).

## 3.0.1

### Patch Changes

- 9d90054: Docs-only: correct `SaasflareShell` usage in the README. The previous example double-wrapped the document by placing `SaasflareShell` inside `<html><body>`. `SaasflareShell` IS the document — it renders `<html>` and `<body>` itself and bakes `palette`/`surface`/`radius`/`animated` into the SSR HTML as `data-*` attributes for zero-FOUT initial paint. Documented the supported props (`lang`, `className`, `bodyClassName`, `head` slot) and clarified when to use `SaasflareProvider` instead (runtime palette switcher with localStorage persistence).

  No code changes.

## 3.0.0

### Major Changes

- 744ebd3: Sweet-spot bundle architecture: 7 peer-heavy components moved to subpath imports; `sonner` bundled directly.

  **Breaking change.** The following components are no longer exported from the main barrel `@saasflare/ui`. Import them via their dedicated subpath instead:

  | Component                       | Before                 | After                            |
  | ------------------------------- | ---------------------- | -------------------------------- |
  | `Calendar`, `CalendarDayButton` | `from "@saasflare/ui"` | `from "@saasflare/ui/calendar"`  |
  | `Carousel*` (already subpath)   | `from "@saasflare/ui"` | `from "@saasflare/ui/carousel"`  |
  | `Chart*` (already subpath)      | `from "@saasflare/ui"` | `from "@saasflare/ui/chart"`     |
  | `Command*`                      | `from "@saasflare/ui"` | `from "@saasflare/ui/command"`   |
  | `Drawer*`                       | `from "@saasflare/ui"` | `from "@saasflare/ui/drawer"`    |
  | `InputOTP*`                     | `from "@saasflare/ui"` | `from "@saasflare/ui/input-otp"` |
  | `Resizable*`                    | `from "@saasflare/ui"` | `from "@saasflare/ui/resizable"` |

  `Form` and `Toaster` **remain** in the main barrel:

  - `Form` is tree-shake-safe because `react-hook-form` declares `sideEffects: false`.
  - `Toaster` (sonner-based) is now bundled directly into `@saasflare/ui` via tsup `noExternal: ['sonner']`. Consumers no longer need to install `sonner` — it ships with the package. Trade-off: ~13 KB gzip extra in the main barrel for all consumers (including those who don't render `<Toaster />`), because sonner injects CSS at module-load time and cannot be tree-shaken. Justified by >80 % Toaster usage in practice.

  **Why:** Subpaths guarantee a worst-case bundle ceiling: consumers who never import a subpath can't accidentally pull in the heavy peer or its wrapper code, even when their bundler's tree-shaker is conservative. The package's main `index.mjs` drops from 201 KB → 184 KB raw (34 KB → 30 KB gzip), and consumers opt into peer dependencies through type-system-enforced imports.

  **Peer dependency changes:**

  - `input-otp` moved from `dependencies` → `peerDependencies` (optional). If you import `@saasflare/ui/input-otp`, install `input-otp@^1`.
  - `cmdk` stays as a direct dependency (used by both `Command` and `Combobox`; `Combobox` remains in the main barrel).
  - All Layer-2 peers are marked `peerDependenciesMeta.<peer>.optional = true` — package managers won't warn when you don't install them.

  **Migration:** Replace barrel imports for the 7 components above with their subpath equivalents. TypeScript will surface every broken import as a compile error, so the codemod is mechanical: search-and-replace the `from "@saasflare/ui"` line per component group.

  ***

  **Per-file `'use client'` migration.** Source files now declare `'use client'`
  themselves only when they actually couple to client-only APIs (React hooks,
  Radix primitives, motion/react, browser globals, or any of the optional peer
  libs). The legacy postbuild that prepended `"use client"` to every dist file
  indiscriminately is gone — replaced by a content-sensitive injector that adds
  the directive only to chunks that actually need it.

  Result: pure-presentational chunks (the `cn`-utility chunks) ship without
  `'use client'` and are RSC-safe. Two of 27 dist files now stay server-component
  eligible. The win is most visible in tiny utility imports (`cn`, motion config
  constants) — Next.js can include them in server components without forcing a
  client boundary.

  Heuristic for chunk classification (see `tsup.config.ts`):

  - imports/requires from `@radix-ui/react-*`, `motion/react`, `next-themes`,
    `cmdk`, `vaul`, `react-day-picker`, `embla-carousel-react`, `recharts`,
    `react-resizable-panels`, `input-otp`, `sonner`, `react-hook-form` → client
  - calls to `useState`, `useEffect`, `useRef`, `useReducer`, `useContext`,
    `createContext`, `useId`, `useImperativeHandle`, `useSyncExternalStore`,
    `useLayoutEffect` → client
  - otherwise → RSC-safe

  This is mostly transparent to consumers — components that previously worked
  in client contexts continue to work; the only change is that very small pure
  utilities can now be imported from `@saasflare/ui` into server components
  without dragging the whole barrel into a client boundary.

## 2.0.0

### Major Changes

- **`@saasflare/ui` 2.0.0 — Next.js-first signaling and metadata correctness.**

  This release reflects the audit finding that 1.x was _technically_ a Next.js UI lib but was _signaling_ like a framework-agnostic component dump. 2.0.0 makes the package metadata match the actual contract.

  ### Breaking — peer dependencies

  Three peer-related changes that may produce install warnings/errors for consumers:

  1. **`react` and `react-dom` peer ranges narrowed to `^19.0.0`** (was `^18.2.0 || ^19.0.0`). Next 16 is React 19-only; supporting React 18 forced us to avoid `useActionState`, `useFormStatus`, `use()` etc. Drop the back-compat.

  2. **`tailwindcss ^4.0.0` is now a required peer.** The package's stylesheet is `@import "tailwindcss"` and uses Tailwind v4 features (`@theme inline`, `@utility`, `@property` declarations in `motion.css`). Consumers always needed Tailwind v4 installed; this just signals it.

  3. **`next` and `next-themes` are now required peers** (removed from `peerDependenciesMeta`). The provider stack (`SaasflareShell` / `SaasflareProvider`) and several common components (`<TopLoadingBar>`, `<Logo>`, `<ThemeModeToggle>`, `<Sonner>`) hard-import `next/*` and `next-themes`. Marking them optional was a polite fiction.

  ### Breaking — Node engines

  `engines.node` is now `>=20`. Next 16 requires Node 20+; documenting it explicitly so `pnpm install` fails fast on older Node.

  ### Bug fix — `"use client"` directive on subpath entries

  `tsup.config.ts`'s `prependUseClient` post-build hook used non-recursive `readdir(dist)`, so `dist/entries/chart.mjs` and `dist/entries/carousel.mjs` shipped **without** the `"use client"` directive in 1.0–1.1.x. That was an RSC-boundary bug: the App Router would treat the chart/carousel imports as Server Components and crash on first render in some setups. The hook now walks `dist/` recursively. All 10 emitted JS files in 2.0.0 carry `"use client"` at the top.

  ### Metadata correctness

  - `description` rewritten to signal Next.js-first positioning instead of framework-neutral "Components Library".
  - `keywords` added (`nextjs`, `app-router`, `rsc`, `server-components`, `tailwindcss`, `tailwind-v4`, `radix-ui`, `motion`, …) for npm discoverability.
  - `homepage` and `bugs.url` added.
  - `sideEffects: false` declared — JS files import nothing for side effects; CSS is consumed via the `./styles` export path, which goes through Tailwind/PostCSS, not the bundler tree-shaker.
  - `./package.json` export added — lets consumers do `import pkg from "@saasflare/ui/package.json"` for version checks etc.

  ### Not in this release — flagged for follow-up

  The audit also called out four items that need actual code/build refactors, not metadata changes. These are **explicitly deferred** to keep the manifest from lying about capabilities:

  - **`react-server` export condition with separate RSC build.** Requires a parallel `tsup` config that emits a Server Component-safe variant (no `"use client"`-tainted re-exports). Roughly a 1-week refactor — own PR.
  - **Per-component subpath exports** (`./button`, `./form`, `./calendar`, `./drawer`, `./toast`, …). Requires new entries under `src/entries/` and a downstream `tsup.config.ts` matrix. Without this, optional peers like `vaul`, `sonner`, `react-day-picker` are still pulled in install-time even when the consumer only uses `<Button>`. Big win when shipped.
  - **`motion` as required peer (matching `next` / `next-themes`).** Currently still optional from 1.1.0. The same logic that makes `next` required (the provider hard-imports it) applies to `motion` (the provider uses `LazyMotion`). Left optional in 2.0.0 because flipping it on top of the React/Tailwind/Next breaks already in this release felt like piling on; tackle in a 2.1 cleanup once the per-component subpaths exist and most components don't need motion.
  - **Next-specific helpers** (`<Image>`/`<Link>`/`<Font>` wrappers, `generateMetadata` helpers). The differentiator vs. shadcn-style libs.

  ### Migration

  ```bash
  # If you were on @saasflare/ui 1.x:
  pnpm remove framer-motion        # already gone in 1.1.0 — keep an eye out
  pnpm add motion next next-themes tailwindcss
  # React 19 required; if still on 18:
  pnpm add react@^19 react-dom@^19
  ```

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
