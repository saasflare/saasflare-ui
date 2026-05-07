---
"@saasflare/ui": major
---

Sweet-spot bundle architecture: 7 peer-heavy components moved to subpath imports; `sonner` bundled directly.

**Breaking change.** The following components are no longer exported from the main barrel `@saasflare/ui`. Import them via their dedicated subpath instead:

| Component | Before | After |
| --- | --- | --- |
| `Calendar`, `CalendarDayButton` | `from "@saasflare/ui"` | `from "@saasflare/ui/calendar"` |
| `Carousel*` (already subpath) | `from "@saasflare/ui"` | `from "@saasflare/ui/carousel"` |
| `Chart*` (already subpath) | `from "@saasflare/ui"` | `from "@saasflare/ui/chart"` |
| `Command*` | `from "@saasflare/ui"` | `from "@saasflare/ui/command"` |
| `Drawer*` | `from "@saasflare/ui"` | `from "@saasflare/ui/drawer"` |
| `InputOTP*` | `from "@saasflare/ui"` | `from "@saasflare/ui/input-otp"` |
| `Resizable*` | `from "@saasflare/ui"` | `from "@saasflare/ui/resizable"` |

`Form` and `Toaster` **remain** in the main barrel:
- `Form` is tree-shake-safe because `react-hook-form` declares `sideEffects: false`.
- `Toaster` (sonner-based) is now bundled directly into `@saasflare/ui` via tsup `noExternal: ['sonner']`. Consumers no longer need to install `sonner` — it ships with the package. Trade-off: ~13 KB gzip extra in the main barrel for all consumers (including those who don't render `<Toaster />`), because sonner injects CSS at module-load time and cannot be tree-shaken. Justified by >80 % Toaster usage in practice.

**Why:** Subpaths guarantee a worst-case bundle ceiling: consumers who never import a subpath can't accidentally pull in the heavy peer or its wrapper code, even when their bundler's tree-shaker is conservative. The package's main `index.mjs` drops from 201 KB → 184 KB raw (34 KB → 30 KB gzip), and consumers opt into peer dependencies through type-system-enforced imports.

**Peer dependency changes:**
- `input-otp` moved from `dependencies` → `peerDependencies` (optional). If you import `@saasflare/ui/input-otp`, install `input-otp@^1`.
- `cmdk` stays as a direct dependency (used by both `Command` and `Combobox`; `Combobox` remains in the main barrel).
- All Layer-2 peers are marked `peerDependenciesMeta.<peer>.optional = true` — package managers won't warn when you don't install them.

**Migration:** Replace barrel imports for the 7 components above with their subpath equivalents. TypeScript will surface every broken import as a compile error, so the codemod is mechanical: search-and-replace the `from "@saasflare/ui"` line per component group.

---

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
