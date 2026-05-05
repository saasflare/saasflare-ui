# Saasflare UI

Public UI repository for [Saasflare](https://saasflare.io).

## Structure

```
saasflare-ui/
├── apps/
│   ├── ui/        ui.saasflare.io — component catalog + UI docs
└── packages/
    └── ui/        @saasflare/ui — design system, published to public npm
```

## Quick start

```bash
pnpm install
pnpm dev:ui     # ui.saasflare.io on :3000
```

## Publish

`@saasflare/ui` is the only publishable artefact. It ships to public npm.

## Related repos (access-restricted)

- `saasflare-saas/`      — paid customer SaaS starter (hosts `@saasflare/mvp` + `@saasflare/saas`)
- `saasflare-marketing/` — content engine (later)