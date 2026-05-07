---
"@saasflare/ui": major
---

Sweet-spot bundle architecture: 8 peer-heavy components moved to subpath imports.

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
| `Toaster` | `from "@saasflare/ui"` | `from "@saasflare/ui/sonner"` |

`Form` **remains** in the main barrel — `react-hook-form` declares `sideEffects: false`, so consumer bundlers reliably tree-shake the import when `Form` is unused. `sonner` does not declare `sideEffects: false` and injects CSS at module-load time, so `Toaster` had to move to a subpath to keep `sonner` (and its CSS) out of bundles that don't render toasts.

**Why:** Subpaths guarantee a worst-case bundle ceiling: consumers who never import a subpath can't accidentally pull in the heavy peer or its wrapper code, even when their bundler's tree-shaker is conservative. The package's main `index.mjs` drops from 201 KB → 184 KB raw (34 KB → 30 KB gzip), and consumers opt into peer dependencies through type-system-enforced imports.

**Peer dependency changes:**
- `input-otp` moved from `dependencies` → `peerDependencies` (optional). If you import `@saasflare/ui/input-otp`, install `input-otp@^1`.
- `cmdk` stays as a direct dependency (used by both `Command` and `Combobox`; `Combobox` remains in the main barrel).
- All Layer-2 peers are marked `peerDependenciesMeta.<peer>.optional = true` — package managers won't warn when you don't install them.

**Migration:** Replace barrel imports for the 7 components above with their subpath equivalents. TypeScript will surface every broken import as a compile error, so the codemod is mechanical: search-and-replace the `from "@saasflare/ui"` line per component group.
