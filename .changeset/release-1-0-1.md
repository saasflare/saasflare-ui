---
"@saasflare/ui": patch
---

Bundle hygiene, subpath split, and LazyMotion adoption.

- Split heavy dependencies into dedicated subpath entries (`@saasflare/ui/chart`, `@saasflare/ui/carousel`) so the root entry stays lean.
- Adopt Framer Motion `LazyMotion` (strict mode) inside `SaasflareShell` to defer animation feature loading until needed.
- Tighten the published `exports` map and `files` allowlist; trim transitive surface area for downstream consumers.
