# @saasflare/ui

The Saasflare design system — an opinionated, themeable React component library
for **Next.js 16 + Tailwind CSS v4**, animated by default. Every component is
motion-aware, powered by Framer Motion and `LazyMotion` for a tight ~25 KB
runtime overhead.

```bash
npm install @saasflare/ui
# or
pnpm add @saasflare/ui
# or
yarn add @saasflare/ui
```

- **Repo:** https://github.com/saasflare/saasflare-ui
- **Catalog:** https://ui.saasflare.io
- **Demo:** https://demo.saasflare.io
- **License:** MIT

---

## Highlights

- **80+ components** — primitives (Button, Dialog, Form, Select, …) and composed
  widgets (PricingCard, FeatureCard, MetricCard, BentoGrid, …).
- **Animated by default** — every interactive primitive ships with motion via
  Framer Motion + `LazyMotion features={domAnimation}` (~25 KB gzip total).
- **Tailwind v4 native** — tokens declared via `@theme`, no `tailwind.config.ts`
  extension required.
- **Theming via CSS variables** — switch palettes by setting `data-palette="…"`
  on `<html>`. 17 presets shipped, custom palettes are one CSS block.
- **Light / dark out of the box** — driven by `next-themes`.
- **TypeScript strict** — full types, no `any`.

---

## Peer dependencies

`@saasflare/ui` is a Next.js-first library. The required peers reflect actual
runtime coupling — there is no graceful degradation if they are missing.

### Required

```bash
pnpm add react react-dom next next-themes framer-motion
```

| Peer            | Range                       | Notes                                    |
| --------------- | --------------------------- | ---------------------------------------- |
| `react`         | `^18.2.0 \|\| ^19.0.0`      |                                          |
| `react-dom`     | `^18.2.0 \|\| ^19.0.0`      |                                          |
| `next`          | `^16.0.0`                   | Next 16 only — buyers on 15 upgrade first |
| `next-themes`   | `^0.4.0`                    | Light/dark mode driver                   |
| `framer-motion` | `^12.0.0`                   | Used eagerly by core primitives          |

`tailwindcss` is **not** a peer dependency — it's a build-time tool. Install it
in your app and add a `@source` directive (see Setup below).

### Optional (in main barrel — tree-shake-friendly)

`Form` lives in the main barrel because `react-hook-form` declares
`"sideEffects": false`, so consumer bundlers reliably eliminate the import when
`Form` is unused. Install only if you use it. `peerDependenciesMeta.optional`
is set, so package managers won't warn if you skip it.

| Component          | Install                                                  |
| ------------------ | -------------------------------------------------------- |
| `Form` + resolvers | `react-hook-form@^7`, `@hookform/resolvers@^5`, `zod@^4` |

### Bundled (no install required)

`Toaster` (sonner-based toast notifications) is bundled directly into
`@saasflare/ui` — no separate `sonner` install needed. Sonner injects ~6 KB
of toast CSS into the document at module load, which adds ~13 KB gzip to the
main barrel for all consumers, including those who don't render `<Toaster />`.
We accepted this trade-off because Toaster usage is >80 % across the Saasflare
codebase and consumers; the extra-import friction was worse than the byte cost.

### Subpath imports (heavy, low-frequency, or non-tree-shakeable peers)

These components are **not in the main barrel** — import them via their
subpath. This keeps the peer (and its side-effects, e.g. CSS injection) out of
consumers who don't use the component.

| Subpath                    | Install                                  | Notes                                    |
| -------------------------- | ---------------------------------------- | ---------------------------------------- |
| `@saasflare/ui/chart`      | `recharts@^3`                            | ~95 KB gzip peer                         |
| `@saasflare/ui/carousel`   | `embla-carousel-react@^8`                | ~25 KB peer                              |
| `@saasflare/ui/calendar`   | `react-day-picker@^9`, `date-fns@^4`     | ~30 KB peer combined                     |
| `@saasflare/ui/drawer`     | `vaul@^1`                                | Mobile drawer / bottom sheet             |
| `@saasflare/ui/command`    | (no extra install — `cmdk` bundled)       | Full Command palette / cmdk-based modal  |
| `@saasflare/ui/input-otp`  | `input-otp@^1`                           | OTP / 2FA input                          |
| `@saasflare/ui/resizable`  | `react-resizable-panels@^4`              | Split-view panels                        |

---

## Setup

### 1. Import the styles bundle and configure Tailwind

```css
/* app/globals.css */
@import "@saasflare/ui/styles";
@source "../node_modules/@saasflare/ui/dist/**/*.{js,mjs}";
```

The `@source` directive tells Tailwind v4's JIT engine to scan the package's
compiled output for utility classes (otherwise they get purged). The `@import
"@saasflare/ui/styles"` line pulls in the `@theme` token block, palette presets,
light/dark surface variables, and motion tokens.

> **Tailwind v3 users:** add the dist path to `content` in `tailwind.config.{js,ts}`:
> ```ts
> content: ["./node_modules/@saasflare/ui/dist/**/*.{js,mjs}", /* ... */]
> ```

### 2. Wrap your app in `SaasflareShell` *(mandatory)*

```tsx
// app/layout.tsx
import { SaasflareShell } from "@saasflare/ui";
import { fontVariables } from "@saasflare/ui/fonts/default";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} data-palette="saasflare" suppressHydrationWarning>
      <body>
        <SaasflareShell>{children}</SaasflareShell>
      </body>
    </html>
  );
}
```

> **⚠️ The wrapper is required, not optional.** `@saasflare/ui` uses
> `LazyMotion features={domAnimation} strict` to keep the framer-motion bundle
> tight. Animated components use the `m.*` API (e.g. `m.button`) which throws
> at runtime if the `LazyMotion` provider is missing. `SaasflareShell` (or
> `SaasflareProvider` directly) provides it. Without one, every `Button`,
> `Card`, `Dialog`, etc. will error on mount.

`SaasflareShell` also owns the theme class, smooth-scroll context, and the
animation kill-switch context.

### 3. Use components

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from "@saasflare/ui";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello Saasflare</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Get started</Button>
      </CardContent>
    </Card>
  );
}
```

Components with heavy or low-frequency peers ship as subpaths:

```tsx
import { ChartContainer, ChartTooltip } from "@saasflare/ui/chart";
import { Carousel, CarouselContent, CarouselItem } from "@saasflare/ui/carousel";
import { Calendar } from "@saasflare/ui/calendar";
import { Drawer, DrawerContent, DrawerTrigger } from "@saasflare/ui/drawer";
import { Command, CommandInput, CommandList } from "@saasflare/ui/command";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@saasflare/ui/input-otp";
import { ResizablePanel, ResizablePanelGroup } from "@saasflare/ui/resizable";
```

---

## Theming

### Switch palette at runtime

```html
<html data-palette="ocean">
```

Built-in presets: `saasflare` (default), `ocean`, `ink`, `aurora`, `indigo`,
`emerald`, `violet`, `coral`, `stone`, `jade`, `cobalt`, `amber`, `fuchsia`,
`honey`, `teal`, `iris`, `ruby`.

### Define a custom palette

Add a block to your global CSS:

```css
:root[data-palette="brand"] {
  --primary-h: 220;
  --primary-c: 0.18;
  --primary-l: 55%;
  /* see packages/ui/styles/palettes.css for the full token list */
}
```

### Light / dark

`SaasflareShell` integrates with `next-themes`. Drop in the `ThemeModeToggle`
component or call `useSaasflareTheme()` for a programmatic API.

---

## Fonts

Six curated presets ship with the package. Pick one or roll your own:

```tsx
import { fontVariables } from "@saasflare/ui/fonts/default";
// or: "@saasflare/ui/fonts/editorial"
//     "@saasflare/ui/fonts/geometric"
//     "@saasflare/ui/fonts/rounded"
//     "@saasflare/ui/fonts/distinctive"
//     "@saasflare/ui/fonts/neutral"
```

Apply `fontVariables` to `<html>` or `<body>` — the CSS variables defined by
the design system pick them up automatically.

---

## Subpath exports

| Path                              | What it is                                                          |
| --------------------------------- | ------------------------------------------------------------------- |
| `@saasflare/ui`                   | Core: components, hooks, providers, utilities (incl. Form, Toaster) |
| `@saasflare/ui/calendar`          | Calendar (requires `react-day-picker`, `date-fns`)                  |
| `@saasflare/ui/carousel`          | Carousel (requires `embla-carousel-react`)                          |
| `@saasflare/ui/chart`             | Chart primitives (requires `recharts`)                              |
| `@saasflare/ui/command`           | Command palette / cmdk modal                                        |
| `@saasflare/ui/drawer`            | Mobile drawer (requires `vaul`)                                     |
| `@saasflare/ui/input-otp`         | OTP input (requires `input-otp`)                                    |
| `@saasflare/ui/resizable`         | Resizable panels (requires `react-resizable-panels`)                |
| `@saasflare/ui/styles`            | Full CSS bundle (alias for `globals.css`)                           |
| `@saasflare/ui/globals.css`       | Same as above, explicit                                             |
| `@saasflare/ui/theme.css`         | Token root only (advanced use)                                      |
| `@saasflare/ui/fonts`             | Font preset registry                                                |
| `@saasflare/ui/fonts/{preset}`    | `default`, `editorial`, `geometric`, `rounded`, `distinctive`, `neutral` |

---

## What's exported from the main entry

- **Utilities:** `cn`
- **Hooks:** `useIsMobile`, `useReducedMotion`, `useDisclosure`, `useMeasure`,
  `usePagination`
- **Providers:** `SaasflareShell`, `SaasflareProvider`, `SaasflareScript`,
  `SmoothScrollProvider`, `useSaasflareTheme`, `useSaasflareProps`,
  `useAnimation`
- **Type tokens:** `PALETTES`, `STYLES`, `RADII`, plus matching TS types
  (`PaletteId`, `StyleVariant`, `Palette`, `Surface`, `Radius`, `Size`,
  `Density`, …)
- **Composed widgets:** `ScrollToTopButton`, `ThemeModeToggle`,
  `TopLoadingBar`, `UserAvatar`
- **All core UI primitives** from `components/ui` (Calendar, Carousel, Chart,
  Command, Drawer, InputOTP, and Resizable are *not* here — see Subpath imports
  above) — full list and live examples in the [catalog](https://ui.saasflare.io).

---

## Versioning

Semantic versioning. Breaking changes to component props, theme tokens, or
palette names ship as major bumps. Release notes live on
[GitHub Releases](https://github.com/saasflare/saasflare-ui/releases).

---

## License

MIT © Saasflare
