# Saasflare UI — Claude Code Configuration

## What this repo is

The **public UI repo** for Saasflare. Free tier of the product.

```
ui.saasflare.io        (apps/ui)         Component catalog + UI docs
demo.saasflare.io      (apps/demo)       Live SaaS-style showcase
@saasflare/ui          (packages/ui)     Published to public npm
```

The internal workbench is `saasflare/`. The paid product is `saasflare-saas/`.

---

## Mission

`@saasflare/ui` is the **API surface for the entire Saasflare design system**. Every
other Saasflare repo (and any external customer) consumes it. There is no "private
fork" of UI components.

```
saasflare/        consumes @saasflare/ui      (apps/web, apps/studio)
saasflare-saas/   consumes @saasflare/ui      (lib/, app/, components/)
external buyer    consumes @saasflare/ui      (free tier)
```

---

## Repo Structure

```
saasflare-ui/
├── apps/
│   ├── ui/                  ui.saasflare.io — component catalog
│   └── demo/                demo.saasflare.io — full-app showcase
├── packages/
│   └── ui/                  @saasflare/ui (published)
│       ├── src/
│       │   ├── components/  Primitives + composed widgets
│       │   ├── hooks/
│       │   ├── lib/         Utilities (cn, color, constants)
│       │   ├── providers/   SaasflareShell, animation, smooth scroll
│       │   ├── entries/     Subpath bundle entries
│       │   └── types/
│       ├── styles/          theme.css, palettes.css, themes.css, motion.css
│       ├── fonts/           Font presets (default, editorial, geometric, ...)
│       └── package.json     "name": "@saasflare/ui"
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── README.md
└── CLAUDE.md
```

---

## Theming — this repo IS the design system

Every theme decision lives here. Five discipline points:

1. **Theme variables live in `packages/ui/styles/`** — `theme.css` (token root),
   `palettes.css` (active brand palette), `themes.css` (light/dark switching).
   Apps never define theme variables.
2. **Tailwind v4 uses CSS `@theme` from `packages/ui/styles/theme.css`** — no app-side
   `tailwind.config.ts extend`.
3. **One entry: `@import "@saasflare/ui/styles"`** — pulls the complete bundle
   (theme + palettes + surfaces + motion + Tailwind v4 `@source` for the package).
   `theme.css` is the token root; `globals.css` is the canonical entry; `./styles`
   is an alias for it.
4. **Provider: `SaasflareShell`** — owns theme class, smooth scroll, animation context.
5. **Fonts: `./fonts/{default,editorial,geometric,rounded,distinctive,neutral}`** —
   apps import `fontVariables` and apply to `<html>`. Apps never declare brand fonts.

### Palette switching

`<html data-palette="{name}">` swaps palette. Current presets in
`packages/ui/styles/palettes.css`: `saasflare` (house), `ocean`, `ink`, `aurora`,
`indigo`, `emerald`, `violet`, `coral`, `stone`, `jade`, `cobalt`, `amber`, `fuchsia`,
`honey`, `teal`, `iris`, `ruby`. Brand changes = edit `palettes.css`.

### Smoke test

Change `--primary-h/c/l` on `:root[data-palette="saasflare"]` in `palettes.css`.
Every app on this monorepo (`apps/{ui,demo}`) and every consumer downstream should
adopt the new accent on next HMR. If one doesn't, the consumer's setup is broken.

---

## Design Principles

1. **Components expose semantic props only** — no micro-styling, no prop bloat.
2. **Animation via Framer Motion** — listed in peer dependencies; consumers provide.
3. **Zero env vars** — `@saasflare/ui` works without configuration.
4. **Own implementation** — no shadcn dependency. We control the primitives.
5. **One component per file**. JSDoc on every export (feeds copilot training).

---

## Apps

### `apps/ui/` — ui.saasflare.io

Component catalog and UI docs. Lead-magnet for the free tier; converts visitors
to discover the paid SaaS starter.

### `apps/demo/` — demo.saasflare.io

"Live SaaS as marketing proof". Full marketing + auth + dashboard flows showing
how `@saasflare/ui` composes into a real app.

**Known issue:** `apps/demo` was historically wired to `@saasflare/mvp` and
`@saasflare/saas` (workspace deps). Those packages now live in `saasflare-saas/lib/`.
The demo's `package.json` still declares them as `workspace:*`, which won't resolve
in this monorepo. Three options:

1. Wait for `@saasflare/mvp` / `@saasflare/saas` to publish, then point demo at
   the published versions.
2. Strip auth/dashboard/landing imports so demo showcases `@saasflare/ui` only.
3. Move `apps/demo` into `saasflare-saas/` and keep this repo focused on the
   public package + catalog.

---

## Publishing

`@saasflare/ui` ships to **public npm**. `apps/ui` and `apps/demo` are not published.

```bash
cd packages/ui
pnpm build
pnpm publish --access public
```

Versioning: semver. Breaking changes to props, theme tokens, or palette names are
major bumps.

---

## Absolute Rules

### Never Touch
- `packages/ui/styles/theme.css` `@theme` block (`@locked` — token contract)
- `packages/ui/package.json` `exports` field (consumer subpaths)
- `@locked`/`@reviewed` files (silent edits forbidden)

### Never Do
- `any` type, default exports, duplicate utilities, hardcoded colors
- Import from `apps/*` inside `packages/ui` (dependency direction is one-way)
- Re-implement a primitive that already exists in `packages/ui`
- Add a Tailwind config extension to an app — extend the design system instead
- Ship to npm without a changeset / version bump

---

## Code Style

- TypeScript strict, no `any`, no default exports
- Files: `kebab-case`, components: `PascalCase`, hooks: `useCamelCase`
- Interfaces over types, `as const` over enums
- One component per file, JSDoc on everything

---

## CLI Commands

```bash
pnpm dev          # turbo: run all dev servers
pnpm dev:ui       # only ui.saasflare.io
pnpm dev:demo     # only demo.saasflare.io
pnpm build        # turbo: build all
pnpm typecheck
pnpm lint
pnpm test
```
