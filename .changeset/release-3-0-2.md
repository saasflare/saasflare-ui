---
"@saasflare/ui": patch
---

Internal cleanup: shorten 104 deep relative imports of `cn` and friends. Components now import from `../../lib` (the package barrel) instead of the deep `../../lib/utils` path. WebStorm's "Import can be shortened" hint no longer fires across the codebase.

No behavior or API change. Bundle size identical (236 KB raw / 43 KB gzip).
