# @saasflare/ui

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
