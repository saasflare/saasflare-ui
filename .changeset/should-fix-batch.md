---
"@saasflare/ui": minor
---

Consistency, a11y, and correctness fixes across the component set.

**iconWeight no longer leaks to the DOM**

- ~50 components extended `SaasflareComponentProps` (which includes `iconWeight`) but only forwarded `surface`/`radius`/`animated` to the resolver, letting `iconWeight` fall through `...props` onto a DOM/Radix/motion element — emitting an unknown `iconWeight` attribute (React 19 warning) for anyone who set it. Every affected component now consumes `iconWeight` via the resolver, so the axis is honored and never reaches the DOM.

**Theming / API**

- `AlertDialogContent` and `SheetContent` now honor the `surface` axis (use `surface-card`, matching `Dialog`/`Drawer`) instead of a hardcoded `bg-background` — the `surface` prop they already advertised now actually renders.
- `Badge` `variant` now accepts the deprecated aliases `"default" | "destructive" | "secondary"` in its type (previously a runtime-only compat map that TypeScript users could not reach).
- `DockItemProps` no longer extends `SaasflareComponentProps` — it advertised `surface`/`radius`/`animated`/`iconWeight` but ignored them (a `DockItem` inherits motion from its parent `Dock` via context). _Type-narrowing note:_ if you passed these no-op props to `DockItem`, remove them.

**Correctness**

- `Dock` magnification used `pageX` against viewport-space bounds, so items magnified at the wrong position once the page scrolled horizontally — now uses `clientX`.
- `SparkChart` `variant="bar"` computed negative bar widths past ~40 points (bars vanished); switched to a proportional slot layout that scales to any point count.
- `Dropzone` drag-active state no longer flickers as the cursor crosses child elements (drag-depth counter instead of a naive `dragleave`).
- `TimelineItem` renders a plain `<div>` when motion is disabled, so motion-off consumers don't instantiate a motion node per item or require the `LazyMotion` provider just for a timeline.

**Accessibility**

- `FlipWords` announces word changes — the `aria-live` region moved from the per-cycle keyed node (never announced) to the stable container.
- `AnimatedTooltip` avatars are now keyboard-focusable and reveal their tooltip on focus, with an accessible label.
- `Rating` exposes `aria-valuetext` (e.g. "4.5 of 5 stars") so half-star values are announced with context.
- `Dock` items reveal their tooltip on keyboard focus, not just hover.
- `Stepper` no longer sets `aria-current="step"` on two nested elements — the decorative `Steps` indicator is hidden from assistive tech, leaving the interactive trigger buttons as the single source.
