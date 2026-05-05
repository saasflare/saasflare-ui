# Saasflare UI

Public UI repository for [Saasflare](https://saasflare.io).

## Structure

```
saasflare-ui/
├── apps/
│   ├── ui/        ui.saasflare.io — component catalog + UI docs
│   └── demo/      demo.saasflare.io — live showcase
└── packages/
    └── ui/        @saasflare/ui — design system, published to public npm
```

## Quick start

```bash
pnpm install
pnpm dev:ui     # ui.saasflare.io on :3000
pnpm dev:demo   # demo on :3001
```

## Publish

`@saasflare/ui` is the only publishable artefact. It ships to public npm.

## Related repos

- `saasflare/`           — internal marketing/sales/CMS workbench
- `saasflare-saas/`      — paid customer SaaS starter (hosts `@saasflare/mvp` + `@saasflare/saas`)
- `saasflare-marketing/` — content engine (later)

## Known issues

`apps/demo` currently imports from `@saasflare/mvp` and `@saasflare/saas`, which moved to
`saasflare-saas`. Until those packages are published to npm (or the demo is simplified to
`@saasflare/ui` only), `pnpm install` in this monorepo will leave those workspace deps
unresolved. Options:

1. Wait for `@saasflare/mvp` + `@saasflare/saas` to publish, then point demo at the
   published versions.
2. Strip the auth/dashboard/landing imports from demo so it showcases `@saasflare/ui` only.
3. Move `apps/demo` into `saasflare-saas` (where its deps live) and keep this monorepo
   focused on the public UI package + catalog.
