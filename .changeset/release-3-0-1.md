---
"@saasflare/ui": patch
---

Docs-only: correct `SaasflareShell` usage in the README. The previous example double-wrapped the document by placing `SaasflareShell` inside `<html><body>`. `SaasflareShell` IS the document — it renders `<html>` and `<body>` itself and bakes `palette`/`surface`/`radius`/`animated` into the SSR HTML as `data-*` attributes for zero-FOUT initial paint. Documented the supported props (`lang`, `className`, `bodyClassName`, `head` slot) and clarified when to use `SaasflareProvider` instead (runtime palette switcher with localStorage persistence).

No code changes.
