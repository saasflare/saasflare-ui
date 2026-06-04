---
"@saasflare/ui": minor
---

Launch-readiness fixes: two broken cursor effects, modal a11y, focus rings, and two unreachable brand exports.

**Critical — effects that never worked**

- `GlowingEffect`: the cursor tracking and hover state lived on the `pointer-events-none` overlay, so the listeners never fired and the glow stayed inert. Tracking now runs on the positioned parent the overlay covers (the same pattern `SpotlightCard` already uses); the overlay stays `pointer-events-none`.
- `MouseGradientBlob`: the `mousemove` listener was bound to the component's own `pointer-events-none` root, so the blob never moved. It now binds to the positioned host element.

**New public exports (previously documented but unreachable)**

- `Logo` / `AppIcon` (and `LogoProps` / `AppIconProps`) are now exported from the package root. Their JSDoc advertised `import { Logo } from '@saasflare/ui'`, but they were never re-exported, so the documented import threw.

**Accessibility**

- `GalleryLightbox` now traps focus and locks body scroll via the shared `useFocusTrap` / `useScrollLock` hooks (matching `HeroVideoDialog`), with focus moved in on open and restored on close. Previously it was an `aria-modal` dialog with no focus management.
- `Input` / `Textarea` now render a motion-independent CSS focus ring (`focus-visible:ring-[3px] ring-ring/50`), matching `NativeSelect`/`SearchField`/`Select`. The focus ring no longer disappears under `prefers-reduced-motion` or `animated={false}` (WCAG 2.4.7).
- `DataTable` footer pagination is now keyboard-operable: the prev/next/number controls use real `href` anchors with `preventDefault` and `tabIndex` on disabled controls, matching `DataPagination`. They were previously `role="button"` anchors with no `href` and so unreachable by keyboard.

**Correctness**

- `AnimatedTestimonials` no longer crashes when the `testimonials` array shrinks below the active index (the render path now clamps the index and the state reconciles).
