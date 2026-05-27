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
  on `<html>`. 20 presets shipped, custom palettes are one CSS block.
- **Light / dark out of the box** — driven by `next-themes`.
- **TypeScript strict** — full types, no `any`.
- **AI-codegen friendly** — shadcn-compatible registry (`npx shadcn add https://ui.saasflare.io/r/<name>.json`) lets AI tools (v0, Lovable, Bolt, Cursor, Claude) pull component source straight into your project. `llms.txt` and `llms-full.txt` published for LLM discovery.

---

## For AI codegen tools

This library publishes three artifacts AI generators can consume:

| URL | Purpose |
|---|---|
| [`https://ui.saasflare.io/llms.txt`](https://ui.saasflare.io/llms.txt) | Concise index (per [llmstxt.org](https://llmstxt.org)) |
| [`https://ui.saasflare.io/llms-full.txt`](https://ui.saasflare.io/llms-full.txt) | Full component reference — props, types, examples |
| [`https://ui.saasflare.io/registry.json`](https://ui.saasflare.io/registry.json) | shadcn-compatible registry index — list of every installable component |
| `https://ui.saasflare.io/api/mcp` | Remote MCP server — let Claude / Cursor / Claude Code query the catalog live (see "MCP server" below) |

### MCP server

Add the endpoint URL to any MCP-aware client and your agent can call `list_components`, `get_component`, `search_components`, `recommend_for_use_case`, `get_install_command`, `list_palettes`, `get_palette`, and `list_hooks` directly.

**Claude Code**
```bash
claude mcp add --transport http saasflare-ui https://ui.saasflare.io/api/mcp
```

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "saasflare-ui": { "url": "https://ui.saasflare.io/api/mcp" }
  }
}
```

**Cursor** (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "saasflare-ui": { "url": "https://ui.saasflare.io/api/mcp" }
  }
}
```

To pull a component's source into a project (the AI-friendly path):

```bash
pnpm add @saasflare/ui                                              # runtime, providers, motion bundle
npx shadcn add https://ui.saasflare.io/r/feature-card.json          # source of one component
npx shadcn add https://ui.saasflare.io/r/pricing-card.json          # …and another
```

The imported files land in your project's `components/ui/` (or wherever your `components.json` aliases point) with all internal imports already rewritten to `@saasflare/ui`. No further wiring needed.

To regenerate locally:

```bash
pnpm --filter @saasflare/ui build:registry   # writes apps/ui/public/r/*.json
pnpm --filter @saasflare/ui build:llms       # writes apps/ui/public/llms{,-full}.txt
```

To add a new component to the registry, append an entry to `packages/ui/registry.json` and rebuild.

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

### 2. Make `SaasflareShell` your document root *(mandatory)*

`SaasflareShell` **is the document** — it renders `<html>` and `<body>`
itself, plus the design-system context inside. Do **not** wrap it in your
own `<html>`/`<body>` tags; replace them entirely.

```tsx
// app/layout.tsx
import { SaasflareShell } from "@saasflare/ui";
import { fontVariables } from "@saasflare/ui/fonts/default";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SaasflareShell
      lang="en"
      palette="saasflare"
      theme="dark"
      className={fontVariables}
    >
      {children}
    </SaasflareShell>
  );
}
```

`SaasflareShell` accepts `palette`, `theme`, `surface`, `radius`,
`animated`, `smoothScrolling`, `storageKey`, plus a `lang`, `className`
(applied to `<html>`), `bodyClassName`, and a `head` slot for `<head>`
content. The chosen `palette`/`surface`/`radius`/`animated` props are
baked into the SSR HTML as `data-*` attributes, so there is **zero FOUT**
and the pre-hydration script is disabled by default.

> **⚠️ Required, not optional.** `@saasflare/ui` uses `LazyMotion
> features={domAnimation} strict` to keep the motion bundle tight.
> Animated components use the `m.*` API (e.g. `m.button`) which throws at
> runtime if `LazyMotion` is missing. `SaasflareShell` (or
> `SaasflareProvider` directly, when you need to own `<html>`/`<body>`
> yourself) provides it. Without one, every `Button`, `Card`, `Dialog`,
> etc. will error on mount.

**When to use `SaasflareProvider` instead:** if you need a runtime palette
switcher (user picks a palette via a toggle, persisted in localStorage),
keep your own `<html>`/`<body>` and wrap children in `SaasflareProvider`.
The provider's pre-hydration script reads localStorage before paint.
`SaasflareShell` is for brand-locked apps where the palette is decided at
SSR time.

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
`honey`, `teal`, `iris`, `ruby`, `colorful`, `craivo`.

`colorful` is special: switching to it auto-applies a soft pastel gradient
on hover (peach → blush → lavender → cyan) wrapped in a matching
color-aura glow, to all outline buttons, feature/testimonial/team/spotlight
cards, and feature-card icon chips on the page. Cards get a gradient
border ring; buttons fill with the pastel sweep. No component-side opt-in.

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
