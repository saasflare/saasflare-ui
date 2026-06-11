---
"@saasflare/ui": minor
---

Hooks roster, sonner singleton fix, and full JSDoc coverage.

- **21 hooks added to the public barrel** (previously unreachable): `useAnimationFrame`, `useClickOutside`, `useClipboard`, `useDebounce`, `useDebouncedCallback`, `useDocumentTitle`, `useEventListener`, `useIdle`, `useInView`, `useIntersectionObserver`, `useKeyboardShortcut`, `useLongPress`, `useMediaQuery`, `useMounted`, `useMousePosition`, `useOnline`, `useParallax`, `usePrevious`, `useScrollLock`, `useScrollPosition`, `useToggle`, `useWindowSize` — with their option/return types.
- Hook fixes applied before export:
  - `useDebouncedCallback`: generic constraint now accepts concretely-typed callbacks (its own @example previously failed `tsc`), and `maxWait` re-arms per burst instead of firing once per component lifetime.
  - `useIntersectionObserver`: inline array `threshold` (the documented usage) no longer re-creates the observer in an infinite loop; observer callback reads the last entry of a batch.
  - `useEventListener`: inline `options` objects no longer tear the listener down every render (deps key on option primitives) — fixes broken `once` semantics.
  - `useLongPress`: pending long-press timer cleared on unmount; latest-ref writes moved out of the render body.
  - `useScrollLock`: restores the body's original `padding-right` instead of clobbering it.
  - `useClipboard`: reset timer cleared on unmount.
- **sonner toast fix:** `sonner` is no longer inlined into the bundle (`noExternal` removed) — the inlined copy had its own toast state, so consumers' `toast()` calls never rendered in the package's `<Toaster>`. `toast` is now also re-exported from `@saasflare/ui` so app code and the Toaster always share one sonner instance.
- **JSDoc on every export is now real:** 218 previously undocumented exported declarations across 56 files got descriptions (the repo contract feeds react-docgen → docs site); generated docs now show descriptions for 300 of 303 components (previously dozens were blank).
- Removed the duplicate non-prologue `"use client"` directive from 27 remaining files.
