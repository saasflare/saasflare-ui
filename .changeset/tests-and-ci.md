---
"@saasflare/ui": patch
---

Test baseline + PR CI.

- vitest + testing-library regression suite (13 tests) pinning every bug class fixed in the review batches: Switch thumb movement, MultiSelect `closeOnSelect` semantics, DatePicker controlled clear (incl. `null`), TagInput separator paste, `useDebouncedCallback` maxWait re-arm + concrete-callback typing, `useCountdown` SSR-safe first paint + expired-target timer, `useFileDialog` option re-application + unmount cleanup, `useScrollLock` padding restore, and the 26-palette PALETTES lockstep.
- GitHub Actions CI on every PR and main push: package build → typecheck → lint → test → app typecheck (previously only a release workflow existed).
