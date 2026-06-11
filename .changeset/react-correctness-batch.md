---
"@saasflare/ui": minor
---

React-correctness fixes (adversarially verified, incl. one Playwright-confirmed critical) + honest peer declarations.

- **Switch: the thumb never moved.** Its only movement mechanism was a Motion `layout` prop, which is silently inert under the `domAnimation` LazyMotion bundle SaasflareShell loads (layout projection lives in `domMax`) — and there was no layout change to animate anyway. Verified live: the thumb's bounding box was pixel-identical in both states; only the track color changed. Now a CSS `translate-x` transform sized per `data-size`, honoring `animated={false}` and `prefers-reduced-motion`.
- **MultiSelect:** removed the equally-inert `layout` prop from chips (enter/exit animations unchanged and working).
- **useCountdown:** no longer reads the clock during render (guaranteed React hydration mismatch on SSR). First paint renders zeros; the live value fills in after mount. An already-expired target no longer starts a timer.
- **TagInput:** pasting `"a, b, c"` kept only the last tag (stale-closure commit loop). Multi-separator pastes now land in one batched state update.
- **Confetti / TypewriterText:** an inline `onComplete` callback no longer restarts the animation on every parent render (latest-ref; effects keyed on real triggers only).
- **Peers made honest:** `react-hook-form` and `react-day-picker` are now **required** peers — the bundled dist imports them eagerly from the main entry, so a default install without them failed at build/require time while the README claimed they were optional. (Proper fix — per-module dist so they become truly optional again — tracked as a follow-up.) README updated; sonner section rewritten to match the un-inlining from the previous changeset.
