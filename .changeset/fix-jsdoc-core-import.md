---
"@saasflare/ui": patch
---

Fix JSDoc `@example` imports across ~70 components. Examples referenced a non-existent `@saasflare/core` package (a 404 on npm); they now correctly import from `@saasflare/ui`. This corrects the import path surfaced in editor IntelliSense, the docs site, and the MCP server.
