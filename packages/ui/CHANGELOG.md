# @saasflare/ui

## 3.11.2

### Patch Changes

- 56c1402: `PricingCard` pins its CTA to the bottom of the card. Plans rarely have the same number of features, so the buttons previously landed at whatever height the feature list ended — the one detail that makes an otherwise finished pricing table look unfinished.

## 3.11.1

### Patch Changes

- b7cfb9b: **Fixes component styling being silently dropped in every consumer app.**

  `styles/theme.css` declared its Tailwind v4 source scan as `@source "../src/components"`, but `package.json` publishes `files: ["dist", "styles", "fonts"]` — `src/` never reaches an installed copy of the package. In any consumer the directive matched nothing, so Tailwind generated no utilities for classes used _inside_ Saasflare components. Anything the consuming app did not also happen to use in its own code was simply missing.

  The visible symptoms were components that render as unstyled blocks: `GradientText` and `AnimatedShinyText` painted a solid rectangle instead of gradient-filled text (`bg-clip-text` was never generated), and a long tail of spacing, animation, and state utilities went missing wherever a component was the only user of them.

  The bug was invisible in this monorepo, where `src/` exists — which is exactly why it shipped. `@source` now points at `dist`, which is published and where tsup preserves the class strings verbatim, so both contexts generate the same utility set. `apps/ui` adds its own `@source` for `src` so package development still hot-reloads.

  Also fixes `AnimatedShinyText` rendering as a single moving sliver of text. It set `text-transparent` alongside a gradient built from `currentColor` — but `text-transparent` _is_ `color: transparent`, so `currentColor` resolved to transparent and only the narrow shimmer band was ever visible. The glyph fill is now made see-through with `-webkit-text-fill-color` alone, leaving `color` intact for `currentColor` to resolve against.

  And drops the `will-change` React state in `BlurFade`: it re-rendered the component twice per entrance to toggle a class that arrives too late to help the compositor anyway. The hint is now written directly to the node.

## 3.11.0

### Minor Changes

- 72fbaee: `MetricCard` gains an optional `description` slot — a secondary line under the value, for the context that makes a number actionable: "of 5,000 this cycle", "3 invites pending", "of 50 GB included".

  Usage metrics are the common case in a SaaS dashboard and they always carry a denominator. Without this, consumers either folded it into the label ("Credits left of 5,000") or abandoned the component for hand-rolled markup.

  Purely additive — omit the prop and the card renders exactly as before.

## 3.10.0

### Minor Changes

- 9cc1a46: Export the sixteen brand logo icons — `GoogleLogoIcon`, `GithubLogoIcon`, `LinkedinLogoIcon`, `AppleLogoIcon`, `DiscordLogoIcon`, `DribbbleLogoIcon`, `FacebookLogoIcon`, `GitlabLogoIcon`, `MediumLogoIcon`, `MicrosoftOutlookLogoIcon`, `PaypalLogoIcon`, `RedditLogoIcon`, `SlackLogoIcon`, `StripeLogoIcon`, `TiktokLogoIcon`, and `XLogoIcon`.

  They have shipped inside the package since the Phosphor icon set landed and are used by `SocialAuthButton`, but were never re-exported from the barrel. Any consumer assembling its own sign-in UI — a login form that needs a provider mark next to a custom button — had to reimplement them or reach into the package internals.

## 3.9.0

### Minor Changes

- abbc9ac: `PricingCard` can now express a real pricing table. `features` accepts descriptors alongside plain strings — `{ label, tooltip?, excluded? }` — so a tier can explain a limit inline and show what it does _not_ include, instead of consumers rebuilding the list markup to get either. Excluded rows render muted with a minus icon and a strikethrough; tooltips get a keyboard-reachable trigger with an accessible name, and a `TooltipProvider` is mounted only when a tooltip is actually present.

  The featured ribbon text is now the `badge` prop (default `"Recommended"`), so it can be translated or replaced without a CSS override.

  Both changes are backward compatible: `features={["a", "b"]}` behaves exactly as before.

  Also registers the five newly exported animated components in the catalog — `AnimatedCounter`, `AnimatedBeam`, `AnimatedShinyText`, `AnimatedCursor`, and `AnimatedTestimonials` now have registry entries, props tables, live demos, and sidebar placement, bringing the catalog to 135 components.

## 3.8.0

### Minor Changes

- ea433c5: Export five components that shipped in the package but were unreachable: `AnimatedBeam`, `AnimatedCounter`, `AnimatedCursor`, `AnimatedShinyText`, and `AnimatedTestimonials`. All five were complete, documented, and bundled into `dist` — they were simply missing from `src/components/ui/index.ts`, so `import { AnimatedCounter } from "@saasflare/ui"` failed to type-check for every consumer.

  Also removes `animated/aurora-background.tsx`, a dead duplicate of the exported `AuroraBackground` that was never imported and would have collided on name.

### Patch Changes

- 8dc2188: BorderBeam: the default `borderRadius="inherit"` produced an invalid `offset-path` (`inherit` is not valid inside `rect(... round <radius>)`), so the beam never traced the border — it rendered as a stationary blurred blob at the container's top-left. The path now falls back to the `--radius` token; explicit `borderRadius` values behave as before.

## 3.7.0

### Minor Changes

- 4259743: Bundleless (per-module) dist — the structural fix behind the bundle-perf findings.

  Every source file now compiles to its own dist module (490 files) instead of one bundled mega-entry per format. All public entry paths (`dist/index.*`, `dist/entries/*`) are unchanged; consumer imports stay identical. What changes:

  - **RSC granularity:** the `"use client"` directive is injected per module — 226 modules ship server-eligible (was 6 chunks), including `cn`, `PALETTES`, and the type/constant modules. The main barrel itself carries no directive anymore. `createSafeContext` moved from `lib/utils` into its own client module so the pure utilities stay server-safe.
  - **Tree-shaking:** consumer bundlers prune per module. A `cn`-only import dropped from ~131 KB to ~26 KB even without `sideEffects` hints, and to near-zero in bundlers that honor the package's `sideEffects` field.
  - **Peer confinement:** `react-hook-form` is referenced only by `form.*` and `react-day-picker` only by `calendar.*` — no longer baked into the shared entry chunk. (They remain required peers for now: CJS `require` of the barrel and Vite dep-prebundling still resolve the full graph.)
  - Declarations now come from `tsc` (per-file, matching the module layout) instead of rollup-dts.

  Validated: every relative specifier in dist resolves (1,420 checked), CJS barrel loads 455 exports, package + app typecheck clean, and a full Next production build of the catalog (141 pages) passes against the new dist.

- 6abccab: Hooks roster, sonner singleton fix, and full JSDoc coverage.

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

- eed071a: React-correctness fixes (adversarially verified, incl. one Playwright-confirmed critical) + honest peer declarations.

  - **Switch: the thumb never moved.** Its only movement mechanism was a Motion `layout` prop, which is silently inert under the `domAnimation` LazyMotion bundle SaasflareShell loads (layout projection lives in `domMax`) — and there was no layout change to animate anyway. Verified live: the thumb's bounding box was pixel-identical in both states; only the track color changed. Now a CSS `translate-x` transform sized per `data-size`, honoring `animated={false}` and `prefers-reduced-motion`.
  - **MultiSelect:** removed the equally-inert `layout` prop from chips (enter/exit animations unchanged and working).
  - **useCountdown:** no longer reads the clock during render (guaranteed React hydration mismatch on SSR). First paint renders zeros; the live value fills in after mount. An already-expired target no longer starts a timer.
  - **TagInput:** pasting `"a, b, c"` kept only the last tag (stale-closure commit loop). Multi-separator pastes now land in one batched state update.
  - **Confetti / TypewriterText:** an inline `onComplete` callback no longer restarts the animation on every parent render (latest-ref; effects keyed on real triggers only).
  - **Peers made honest:** `react-hook-form` and `react-day-picker` are now **required** peers — the bundled dist imports them eagerly from the main entry, so a default install without them failed at build/require time while the README claimed they were optional. (Proper fix — per-module dist so they become truly optional again — tracked as a follow-up.) README updated; sonner section rewritten to match the un-inlining from the previous changeset.

- 6abccab: Strict-review fix batch — correctness, a11y, and contract repairs across the package.

  **Behavioral fix (flagged):** `MultiSelect.closeOnSelect` semantics were inverted relative to the prop name (`true` kept the popover open). The prop now means what it says — `true` closes on each pick — and the default flipped to `false`, so **default behavior is unchanged**. Only consumers who passed `closeOnSelect` explicitly see a change (they previously got the opposite of what the name promised).

  Fixes:

  - **Button** `variant="shadow"` rendered no shadow (consumed `--btn-shadow`, which was never defined). Now renders a palette-aware OKLCH intent shadow.
  - **PALETTES/PaletteId** extended from 20 to all 26 palettes defined in `palettes.css` — adds `saasflare` (house palette), `lavender`, `mint`, `sage`, `sky`, `snow`.
  - **useFileDialog** no longer pins first-call `onChange`/`accept`/`multiple`/`capture`/`directory` forever (options re-applied on every `open()`, listener reads a latest-ref) and removes its hidden `<input>` on unmount. Fixes stale validation/callbacks in Dropzone's click path.
  - **DataTable** no longer sets `role="button"` on clickable `<tr>` (it destroyed table semantics for screen readers); rows stay focusable with Enter/Space activation and expose `data-clickable`.
  - **MultiSelect** chip-remove and clear-all affordances are no longer focusable controls nested inside the trigger `<button>` (invalid interactive nesting); they are mouse-only now, with Backspace on the trigger/empty search input as the keyboard path (trigger Backspace added).
  - **NotificationCenter** rows use a stretched-overlay action instead of nesting the mark-as-read `<button>` inside a row `<button>`/`<a>`; unread state is now announced (sr-only text + `Unread:` action label).
  - **DatePicker/DateRangePicker** controlled clear works: controlled-ness is latched (writing back the `undefined` emitted on deselect no longer flips the component to uncontrolled), and `value` accepts `null` for controlled-empty.
  - **Size axis unified on `"md"`**: Avatar, Switch, NativeSelect, SelectTrigger, Toggle, ToggleGroup, Item, SidebarMenuButton, ThemeModeMultiToggle migrate `"default"` → `"md"` (canonical `Size` scale). `"default"` remains accepted as a deprecated alias.
  - **SocialButton** deprecated in favor of `SocialAuthButton`; its conflicting `SocialProvider` type renamed to `SocialButtonProvider` (the package-level `SocialProvider` export is the 16-provider union); hardcoded grays/hex replaced with tokens.
  - **SaasflareProvider** no longer crashes on corrupted persisted prefs (`null`/non-object localStorage values normalize to defaults, matching the inline script's defense).
  - **snow palette** pins a visible focus ring per mode; **achromatic palette** joins the fixed 5-hue chart override group (charts were collapsing to grayscale).
  - Removed duplicate `"use client"` directives (form, use-local-storage); fixed the stale `themes.css` reference in the styles entry docs.

### Patch Changes

- 9f83c23: Runtime-perf cleanups (verified review minors) + full catalog coverage.

  - **SpotlightCard / GlowingEffect**: cursor tracking moved out of React state — position is written as CSS variables directly on the overlay (no per-frame re-render), and the container rect is cached for the hover duration instead of a forced-layout `getBoundingClientRect` per mousemove (invalidated on enter/scroll/resize).
  - **MouseGradientBlob**: same rect caching in the mousemove hot path.
  - **DockItem**: item centers are cached instead of reading `getBoundingClientRect` for every item on every mouseX update while the width spring writes layout per frame (the classic read/write thrash interleave).
  - **ScrollToTopButton**: the scroll-container resolver gives up after ~10s with a dev warning instead of polling `getElementById` every frame forever when the id never mounts.
  - **Docs**: `Logo` and `AppIcon` join the catalog (registry, props, doc pages, demos) — the generated docs now cover all 130 public components.

- bc0ca46: Test baseline + PR CI.

  - vitest + testing-library regression suite (13 tests) pinning every bug class fixed in the review batches: Switch thumb movement, MultiSelect `closeOnSelect` semantics, DatePicker controlled clear (incl. `null`), TagInput separator paste, `useDebouncedCallback` maxWait re-arm + concrete-callback typing, `useCountdown` SSR-safe first paint + expired-target timer, `useFileDialog` option re-application + unmount cleanup, `useScrollLock` padding restore, and the 26-palette PALETTES lockstep.
  - GitHub Actions CI on every PR and main push: package build → typecheck → lint → test → app typecheck (previously only a release workflow existed).

## 3.6.0

### Minor Changes

- ec4a289: Consistency, a11y, and correctness fixes across the component set.

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

## 3.5.0

### Minor Changes

- 5a691ea: Launch-readiness fixes: two broken cursor effects, modal a11y, focus rings, and two unreachable brand exports.

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

## 3.4.0

### Minor Changes

- 11eb992: Add data-driven and wizard components plus Button/overlay parity — all additive, no breaking changes.

  **New components**

  - **`DataTable`** + **`useDataTable`** — dependency-free, typed data grid built on the Table primitives: typed column defs, client-side single/multi-column sort, row selection (current-page select-all), client-side pagination, density, sticky header, loading/empty states, and a documented `manualSort`/`manualPagination` escape hatch for server-side / TanStack. Sort + select + paginate in ~15 LOC with zero extra dependencies.
  - **`MultiSelect`** — searchable multi-select (Popover + cmdk) with chips, select-all, `max`, `+N more` collapse, and async option loading via `onSearchChange`. Plain `string[]` value.
  - **`Stepper`** + **`useStepper`** (+ `StepperNav` / `StepperPanel` / `StepperContent`) — a controlled multi-step wizard over the existing visual `Steps`: linear / non-linear flow, optional steps, and an async validation gate before advancing. The headless `useStepper` hook composes with the bare `Steps` indicator too.
  - **`DataPagination`** + **`paginationSummary`** — total-driven pagination convenience: prev/next, numbered pages with ellipsis, an optional page-size selector, and an "X–Y of N" summary. One component wires a whole table footer.

  **API parity additions**

  - **`Button`** — new optional `startContent`, `endContent`, `isLoading`, `isIconOnly`, and `spinnerPlacement` props (`StatefulButton` now delegates its loading state to `Button.isLoading`).
  - **Overlays** — `DialogContent` gains `showCloseButton` (defaults to current behavior); `PopoverArrow`, `TooltipArrow`, and `HoverCardArrow` sub-components added for the floating overlays.
  - `Step` gains an additive optional `optional` prop.

- 11eb992: Make the `SaasflareComponentProps` contract consistent across the catalog, fix verified correctness bugs, and clean up quality issues. Additive — no public API removed or renamed.

  **Contract consistency** — every visibly-rendering component now extends `SaasflareComponentProps` and resolves `surface` / `radius` / `animated` / `iconWeight` via `useSaasflareProps`, emitting the `data-surface` / `data-radius` / `data-animated` attributes (coverage went from ~91 to 131 files). Concretely this fixes three systemic gaps:

  - **Motion kill-switch** — ~15 JS-motion components (e.g. `HeroVideoDialog`, `Dock`, `Timeline`, `GalleryLightbox`, `AnimatedTooltip`, `BentoGridItem`) gated only on `useReducedMotion()` and silently ignored `animated={false}`; they now honor it via `useSaasflareMotion`.
  - **`data-animated` emission** — CSS-motion components (`Toggle`, `Avatar`, `Sheet`, `StatCard`, `TeamCard`, `TestimonialCard`, `TagInput`, `FeatureCard`, …) now emit the attribute so the per-component motion gate actually engages.
  - **Off-contract primitives** — `Separator`, `Label`, `Kbd`, `Item`, `ButtonGroup`, `GradientText`, and others now accept the standard axes.

  **Correctness fixes (44 verified)** — including 3 `Math.random()` SSR-hydration bugs replaced with `useId()` (sidebar skeleton, `Rating` clip-path, animated `beam` gradient), `CommandDialog` a11y nesting, `AppIcon` dropping its ref/props, `Form` hook-order, `MouseGradientBlob` global selector, animated `cursor` listener leak, and missing `"use client"` on `StatCard` / `TeamCard` / `Empty` / `FeatureCard` (RSC crash).

  **Quality** — replaced hardcoded colors with design tokens (brand colors preserved), swapped reimplemented inline `<svg>` icons for Phosphor icons that honor `iconWeight` (e.g. `Steps` checkmark), removed 3 empty stub files, and corrected stale `@module` / "Framer Motion" doc labels. Also fixed the `social-button` registry description, which incorrectly advertised 16 providers (it supports 5; the 16-provider component is `SocialAuthButton`).

  **Documentation** — the docs catalog + shadcn registry now also cover 9 previously-undocumented public exports (`Sidebar` system, `SocialAuthButton`, `StatefulButton`, `ThemeModeToggle`, `ThemeModeMultiToggle`, `UserAvatar`, `TopLoadingBar`, `ScrollToTopButton`, `AnimatedTooltip`), so every shipped export now has a props table, demos, and an installable registry block.

## 3.3.1

### Patch Changes

- 340ddfa: Fix invisible/broken default colors across the effects & motion components. Their
  defaults wrapped design tokens in `hsl(...)` (e.g. `hsl(var(--primary))`), but the
  Saasflare token system is OKLCH — `--primary`, `--chart-1..4`, `--ring`, `--border`
  all resolve to full `oklch(...)` colors, so `hsl(oklch(...))` was invalid CSS and
  rendered as `none` (transparent). Most visibly, `GradientText` produced invisible
  text by default.

  Affected components now reference the tokens directly (`var(--primary)`) and use
  `color-mix()` for alpha: `GradientText`, `Confetti`, `MouseGradientBlob`,
  `ShimmerButton`, `SpotlightCard`, `TracingBeam`, `BorderBeam`, `GlowingEffect`,
  `MovingBorder`, `AuroraBackground`, `ParticlesBackground`, `Hotspot`, `RetroGrid`,
  `Input`/`Textarea` focus ring, and the animated `beam`/`shiny-text`/`cursor`
  variants. No API changes — defaults and JSDoc examples are corrected in place.

## 3.3.0

### Minor Changes

- 72dd599: Export 36 catalog-expansion components from the main barrel so they are importable from `@saasflare/ui` (previously they shipped only via the shadcn registry and were not part of the package's public API): `AudioPlayer`, `BentoGrid`/`BentoGridItem`, `BlurFade`, `BorderBeam`, `Compare`, `Confetti`, `Countdown` (+ `useCountdown`), `SafariMock`/`IPhoneMock`, `Dock`/`DockItem`, `FeatureCard`, `FlipWords`, `GalleryLightbox`, `GlowingEffect`, `GradientText`, `HeroVideoDialog`, `Hotspot`/`HotspotMarker`, `ImageSwapHover`, `Marquee`, `MouseGradientBlob`, `MovingBorder`, `PageTransition`, `ParallaxSection`, `ParticlesBackground`, `RetroGrid`, `RevealOnScroll`, `ShimmerButton`, `SocialButton`, `SpotlightCard`, `StatCard`, `Steps`/`Step`, `StickyScrollReveal`, `TeamCard`, `TestimonialCard`, `TextGenerateEffect`, `Timeline`/`TimelineItem`, `TracingBeam`.

### Patch Changes

- 72dd599: Fix JSDoc `@example` imports across ~70 components. Examples referenced a non-existent `@saasflare/core` package (a 404 on npm); they now correctly import from `@saasflare/ui`. This corrects the import path surfaced in editor IntelliSense, the docs site, and the MCP server.

## 3.2.0

### Minor Changes

- 3a6e081: Catalog expansion: Tremor-style data viz, new composed widgets, brand auth, and stateful interactions.

  **New components**

  - Data viz: `BarList`, `CategoryBar`, `Tracker`, `SparkChart`, `ProgressCircle`
  - Inputs: `DatePicker`, `DateRangePicker`, `NumberInput`, `Dropzone`, `TagInput`, `Rating`
  - Surfaces: `AuroraBackground`, `Callout`, `CodeBlock`, `NotificationCenter`, `TreeView`
  - Composed: `StatefulButton`, `ThemeModeMultiToggle`
  - Brand: `SocialAuthButton` and 16 provider presets (`GoogleAuthButton`, `GitHubAuthButton`, `AppleAuthButton`, …)
  - Icons: internal `Phosphor` icon set wired to `iconWeight` prop

  **New hooks**

  - `useLocalStorage`, `useMergedRef`, `useInterval`, `useFocusTrap`, `useFileDialog`

  **Theming**

  - New `aurora` surface variant alongside `flat`/`glass`/`clay`
  - `data-radius` selectors descoped from `:root` so component-level `radius` prop now overrides page-wide radius
  - Palette expansions

  **Internal**

  - Drop unused `lucide-react` dependency
  - Build pipeline now emits component registry + LLM docs alongside `tsup` bundle

## 3.1.2

### Patch Changes

- 6964e5b: Fix: `intent="neutral"` rendered illegibly on transparent-bg variants of `Button` (soft, outline, ghost, link, glass) and `Badge` (soft, outline) because `--intent` resolved to a light surface color (`--secondary`) and was used as text color. Also fixes a parallel bug where `Button` outline/ghost/link with colored intents rendered white text on white pages.

  Adds a third intent token `--intent-text` to `theme.css`. For colored intents it equals `--intent` (no visual change). For neutral it falls back to `--secondary-foreground` (dark gray), so transparent-bg variants stay legible regardless of intent.

  Variants updated to use `--intent-text` for text/border colors when the surface is transparent or tinted:

  - `Button`: soft, outline, ghost, link, glass
  - `Badge`: soft, outline

  `solid` and `shadow` variants are unchanged (they correctly use `--intent` for fill and `--intent-fg` for paired text). The `Intent` type and `data-intent` attribute are unchanged.

## 3.1.1

### Patch Changes

- de46f77: Fix: light-mode `--secondary` was nearly invisible against white backgrounds. Lightness dropped from 0.965 → 0.92 (and chroma multiplier bumped 1× → 1.5× to inherit a hint of palette warmth). Secondary buttons, badges, and `bg-secondary` surfaces now register as a clearly visible mid-gray fill instead of collapsing into the page.

  `--secondary-foreground` is unchanged — still passes WCAG AA against the new fill (~6.8 : 1).

  Dark mode, `--muted`, and `--accent` are untouched.

## 3.1.0

### Minor Changes

- 0fe5dbf: Universal compliance: every visible component now respects `surface`, `radius`, and `animated` from `<SaasflareProvider>` or per-component override.

  **What changed.** Per the documented universal contract in `useSaasflareProps`, every Saasflare component must extend `SaasflareComponentProps` and resolve via `useSaasflareProps()`. Before this release, only `Button` did. Now all 55 active-pattern components do — including Card, Dialog, Checkbox, Switch, Tabs, Select, DropdownMenu, all subpath primitives (Calendar, Carousel, Chart, Command, Drawer, InputOTP, Resizable), and all composed SaaS widgets (PricingCard, MetricCard, …).

  **Three implementation patterns** (see `packages/ui/docs/component-compliance.md` for the full spec):

  - **Pattern A** — Framer-Motion components (Cat 1, 19): hook stack with `useSaasflareMotion` for transition gating.
  - **Pattern B** — CSS-motion components (Cat 2, 9): props + data-attrs only; the global CSS layer in `motion.css` zeroes out `animation-duration`/`transition-duration` when `data-animated="false"`.
  - **Pattern C** — subset (Cat 3+4+5): only the applicable props are consumed; non-applicable props are accepted at the type level for consistency.

  **New helper.** `useSaasflareMotion(animated, base?, ...extraDisablers)` in `motion-config.ts` is the single resolver for component motion. Returns `{ transition, disabled }` where `transition` is the active spring (or `noMotion`) and `disabled` is true when motion should be skipped (provider opt-out, OS reduced-motion, or any extra disabler like `disabled`/`loading`).

  **Behavior change** (technically non-breaking, but observable). Components that previously ignored `animated={false}` from `<SaasflareProvider>` now respect it consistently. If you relied on per-component animations running despite a global opt-out, set `animated={true}` per-component explicitly. Same applies to `surface` and `radius` overrides — components now follow provider context where they previously silently used hardcoded defaults.

  **Bundle impact.** Main barrel grew from **236 KB raw / 43.4 KB gzip** to **248 KB raw / 44.1 KB gzip** — +509 bytes gzipped across all 55 component refactors. Marginal cost for universal API consistency.

  **Sheet reclassified** from Cat 1 to Cat 2 in the doc — it uses pure CSS animations, not Framer Motion. No functional change.

## 3.0.2

### Patch Changes

- 08e9a06: Internal cleanup: shorten 104 deep relative imports of `cn` and friends. Components now import from `../../lib` (the package barrel) instead of the deep `../../lib/utils` path. WebStorm's "Import can be shortened" hint no longer fires across the codebase.

  No behavior or API change. Bundle size identical (236 KB raw / 43 KB gzip).

## 3.0.1

### Patch Changes

- 9d90054: Docs-only: correct `SaasflareShell` usage in the README. The previous example double-wrapped the document by placing `SaasflareShell` inside `<html><body>`. `SaasflareShell` IS the document — it renders `<html>` and `<body>` itself and bakes `palette`/`surface`/`radius`/`animated` into the SSR HTML as `data-*` attributes for zero-FOUT initial paint. Documented the supported props (`lang`, `className`, `bodyClassName`, `head` slot) and clarified when to use `SaasflareProvider` instead (runtime palette switcher with localStorage persistence).

  No code changes.

## 3.0.0

### Major Changes

- 744ebd3: Sweet-spot bundle architecture: 7 peer-heavy components moved to subpath imports; `sonner` bundled directly.

  **Breaking change.** The following components are no longer exported from the main barrel `@saasflare/ui`. Import them via their dedicated subpath instead:

  | Component                       | Before                 | After                            |
  | ------------------------------- | ---------------------- | -------------------------------- |
  | `Calendar`, `CalendarDayButton` | `from "@saasflare/ui"` | `from "@saasflare/ui/calendar"`  |
  | `Carousel*` (already subpath)   | `from "@saasflare/ui"` | `from "@saasflare/ui/carousel"`  |
  | `Chart*` (already subpath)      | `from "@saasflare/ui"` | `from "@saasflare/ui/chart"`     |
  | `Command*`                      | `from "@saasflare/ui"` | `from "@saasflare/ui/command"`   |
  | `Drawer*`                       | `from "@saasflare/ui"` | `from "@saasflare/ui/drawer"`    |
  | `InputOTP*`                     | `from "@saasflare/ui"` | `from "@saasflare/ui/input-otp"` |
  | `Resizable*`                    | `from "@saasflare/ui"` | `from "@saasflare/ui/resizable"` |

  `Form` and `Toaster` **remain** in the main barrel:

  - `Form` is tree-shake-safe because `react-hook-form` declares `sideEffects: false`.
  - `Toaster` (sonner-based) is now bundled directly into `@saasflare/ui` via tsup `noExternal: ['sonner']`. Consumers no longer need to install `sonner` — it ships with the package. Trade-off: ~13 KB gzip extra in the main barrel for all consumers (including those who don't render `<Toaster />`), because sonner injects CSS at module-load time and cannot be tree-shaken. Justified by >80 % Toaster usage in practice.

  **Why:** Subpaths guarantee a worst-case bundle ceiling: consumers who never import a subpath can't accidentally pull in the heavy peer or its wrapper code, even when their bundler's tree-shaker is conservative. The package's main `index.mjs` drops from 201 KB → 184 KB raw (34 KB → 30 KB gzip), and consumers opt into peer dependencies through type-system-enforced imports.

  **Peer dependency changes:**

  - `input-otp` moved from `dependencies` → `peerDependencies` (optional). If you import `@saasflare/ui/input-otp`, install `input-otp@^1`.
  - `cmdk` stays as a direct dependency (used by both `Command` and `Combobox`; `Combobox` remains in the main barrel).
  - All Layer-2 peers are marked `peerDependenciesMeta.<peer>.optional = true` — package managers won't warn when you don't install them.

  **Migration:** Replace barrel imports for the 7 components above with their subpath equivalents. TypeScript will surface every broken import as a compile error, so the codemod is mechanical: search-and-replace the `from "@saasflare/ui"` line per component group.

  ***

  **Per-file `'use client'` migration.** Source files now declare `'use client'`
  themselves only when they actually couple to client-only APIs (React hooks,
  Radix primitives, motion/react, browser globals, or any of the optional peer
  libs). The legacy postbuild that prepended `"use client"` to every dist file
  indiscriminately is gone — replaced by a content-sensitive injector that adds
  the directive only to chunks that actually need it.

  Result: pure-presentational chunks (the `cn`-utility chunks) ship without
  `'use client'` and are RSC-safe. Two of 27 dist files now stay server-component
  eligible. The win is most visible in tiny utility imports (`cn`, motion config
  constants) — Next.js can include them in server components without forcing a
  client boundary.

  Heuristic for chunk classification (see `tsup.config.ts`):

  - imports/requires from `@radix-ui/react-*`, `motion/react`, `next-themes`,
    `cmdk`, `vaul`, `react-day-picker`, `embla-carousel-react`, `recharts`,
    `react-resizable-panels`, `input-otp`, `sonner`, `react-hook-form` → client
  - calls to `useState`, `useEffect`, `useRef`, `useReducer`, `useContext`,
    `createContext`, `useId`, `useImperativeHandle`, `useSyncExternalStore`,
    `useLayoutEffect` → client
  - otherwise → RSC-safe

  This is mostly transparent to consumers — components that previously worked
  in client contexts continue to work; the only change is that very small pure
  utilities can now be imported from `@saasflare/ui` into server components
  without dragging the whole barrel into a client boundary.

## 2.0.0

### Major Changes

- **`@saasflare/ui` 2.0.0 — Next.js-first signaling and metadata correctness.**

  This release reflects the audit finding that 1.x was _technically_ a Next.js UI lib but was _signaling_ like a framework-agnostic component dump. 2.0.0 makes the package metadata match the actual contract.

  ### Breaking — peer dependencies

  Three peer-related changes that may produce install warnings/errors for consumers:

  1. **`react` and `react-dom` peer ranges narrowed to `^19.0.0`** (was `^18.2.0 || ^19.0.0`). Next 16 is React 19-only; supporting React 18 forced us to avoid `useActionState`, `useFormStatus`, `use()` etc. Drop the back-compat.

  2. **`tailwindcss ^4.0.0` is now a required peer.** The package's stylesheet is `@import "tailwindcss"` and uses Tailwind v4 features (`@theme inline`, `@utility`, `@property` declarations in `motion.css`). Consumers always needed Tailwind v4 installed; this just signals it.

  3. **`next` and `next-themes` are now required peers** (removed from `peerDependenciesMeta`). The provider stack (`SaasflareShell` / `SaasflareProvider`) and several common components (`<TopLoadingBar>`, `<Logo>`, `<ThemeModeToggle>`, `<Sonner>`) hard-import `next/*` and `next-themes`. Marking them optional was a polite fiction.

  ### Breaking — Node engines

  `engines.node` is now `>=20`. Next 16 requires Node 20+; documenting it explicitly so `pnpm install` fails fast on older Node.

  ### Bug fix — `"use client"` directive on subpath entries

  `tsup.config.ts`'s `prependUseClient` post-build hook used non-recursive `readdir(dist)`, so `dist/entries/chart.mjs` and `dist/entries/carousel.mjs` shipped **without** the `"use client"` directive in 1.0–1.1.x. That was an RSC-boundary bug: the App Router would treat the chart/carousel imports as Server Components and crash on first render in some setups. The hook now walks `dist/` recursively. All 10 emitted JS files in 2.0.0 carry `"use client"` at the top.

  ### Metadata correctness

  - `description` rewritten to signal Next.js-first positioning instead of framework-neutral "Components Library".
  - `keywords` added (`nextjs`, `app-router`, `rsc`, `server-components`, `tailwindcss`, `tailwind-v4`, `radix-ui`, `motion`, …) for npm discoverability.
  - `homepage` and `bugs.url` added.
  - `sideEffects: false` declared — JS files import nothing for side effects; CSS is consumed via the `./styles` export path, which goes through Tailwind/PostCSS, not the bundler tree-shaker.
  - `./package.json` export added — lets consumers do `import pkg from "@saasflare/ui/package.json"` for version checks etc.

  ### Not in this release — flagged for follow-up

  The audit also called out four items that need actual code/build refactors, not metadata changes. These are **explicitly deferred** to keep the manifest from lying about capabilities:

  - **`react-server` export condition with separate RSC build.** Requires a parallel `tsup` config that emits a Server Component-safe variant (no `"use client"`-tainted re-exports). Roughly a 1-week refactor — own PR.
  - **Per-component subpath exports** (`./button`, `./form`, `./calendar`, `./drawer`, `./toast`, …). Requires new entries under `src/entries/` and a downstream `tsup.config.ts` matrix. Without this, optional peers like `vaul`, `sonner`, `react-day-picker` are still pulled in install-time even when the consumer only uses `<Button>`. Big win when shipped.
  - **`motion` as required peer (matching `next` / `next-themes`).** Currently still optional from 1.1.0. The same logic that makes `next` required (the provider hard-imports it) applies to `motion` (the provider uses `LazyMotion`). Left optional in 2.0.0 because flipping it on top of the React/Tailwind/Next breaks already in this release felt like piling on; tackle in a 2.1 cleanup once the per-component subpaths exist and most components don't need motion.
  - **Next-specific helpers** (`<Image>`/`<Link>`/`<Font>` wrappers, `generateMetadata` helpers). The differentiator vs. shadcn-style libs.

  ### Migration

  ```bash
  # If you were on @saasflare/ui 1.x:
  pnpm remove framer-motion        # already gone in 1.1.0 — keep an eye out
  pnpm add motion next next-themes tailwindcss
  # React 19 required; if still on 18:
  pnpm add react@^19 react-dom@^19
  ```

## 1.1.2

### Patch Changes

- Add TypeScript 6 support. Bumps `typescript` devDep from `^5.9.3` to `^6.0.3`. Affects how the package is developed and how `.d.ts` files are emitted; consumer-visible only via the (unchanged) `.d.ts` output, which still typechecks under TS 5 and TS 6.

  Configuration adjustments to satisfy TS 6's stricter deprecation rules:

  - Removed `baseUrl` from `tsconfig.base.json` and `apps/ui/tsconfig.json`. It was only there as boilerplate; nothing in the workspace relied on bare-path resolution. `apps/ui`'s `paths: { "@/*": ["./*"] }` now resolves relative to the tsconfig file, which TypeScript 5.4+ supports natively.
  - Added `ignoreDeprecations: "6.0"` to `tsconfig.base.json`. This is a workaround for [tsup 8.5.1's DTS bundler](https://github.com/egoist/tsup/blob/main/src/rollup.ts), which hard-codes `baseUrl: compilerOptions.baseUrl || "."` when synthesizing the DTS rollup config. The injected default trips TS 6's deprecation error even though our own configs are clean. Once tsup releases a fix, this opt-out can be dropped.

  Verified: `packages/ui` typecheck + tsup build (CJS, ESM, DTS) green; `apps/ui` typecheck + full Next 16 production build green.

## 1.1.1

### Patch Changes

- Bump `lucide-react` floor from `^0.577.0` to `^1.14.0`. Lucide cut its `1.0` stability release in March 2026; the API surface and React peer range are unchanged. Verified by `pnpm -F @saasflare/ui typecheck` + `build` and `pnpm -F @saasflare/demo-ui typecheck` against all 34 internal icon imports.

  If a consumer previously installed `lucide-react` directly with a `^0.x` range, they should align to `^1.x` to avoid duplicate copies in their tree.

  No other dependency or peer range changes — every other package stays in its existing caret range, and the resolved versions on `pnpm install` are already current.

## 1.1.0

### Minor Changes

- **Switch from `framer-motion` to `motion` (the library's new package name) and drop the `tw-animate-css` runtime dependency.**

  Breaking-ish for installers — read below before upgrading.

  ### Animation peer changed: `framer-motion` → `motion`

  The Motion team renamed the npm package from `framer-motion` to `motion` (same maintainers, same code, identical API surface, exposed under `motion/react`). All 40 internal imports were swapped from `from "framer-motion"` to `from "motion/react"`. No runtime behavior changes.

  If you had `framer-motion` installed for `@saasflare/ui`, install `motion` instead:

  ```bash
  pnpm add motion
  pnpm remove framer-motion
  ```

  `motion` is now declared as an **optional** peer (`peerDependenciesMeta.motion.optional = true`) — components that don't animate work without it.

  ### `tw-animate-css` no longer a runtime dependency

  The handful of utilities we actually use (`animate-in`/`animate-out`, `fade-*`, `zoom-*`, `slide-*` on cardinal axes, plus `accordion-down`/`accordion-up` and `caret-blink` keyframes) are now vendored directly into `packages/ui/styles/motion.css` as Tailwind v4 `@utility` blueprints. The `@import "tw-animate-css"` in `theme.css` is gone, and the package is dropped from `dependencies`.

  Consumer-visible effect: one less transitive npm install. No CSS class name changes.

  ### `next` and `next-themes` peer adjustments

  - `next` peer range loosened from `^16.0.0` to `^15.0.0 || ^16.0.0`.
  - `next` and `next-themes` are now **optional** peers — only required if you actually import the components that use them (`<TopLoadingBar>`, `<Logo>`, `<AnimatedTooltip>`, `<ThemeModeToggle>`, `<Sonner>`, the `SaasflareProvider` theme bridge).

## 1.0.2

### Patch Changes

- Move `react`, `react-dom`, `next`, and `next-themes` out of `devDependencies`. They are already declared as `peerDependencies`, so duplicating them in `devDependencies` risked dual-React installs in consumer trees (the classic "Invalid hook call" symptom) and gave no benefit beyond what pnpm's `auto-install-peers` already provides.

  No runtime change for consumers. `@types/react` / `@types/react-dom` stay in `devDependencies` since they are type-only and needed for the local build.

## 1.0.1

### Patch Changes

- c574cfc: Bundle hygiene, subpath split, and LazyMotion adoption.

  - Split heavy dependencies into dedicated subpath entries (`@saasflare/ui/chart`, `@saasflare/ui/carousel`) so the root entry stays lean.
  - Adopt Framer Motion `LazyMotion` (strict mode) inside `SaasflareShell` to defer animation feature loading until needed.
  - Tighten the published `exports` map and `files` allowlist; trim transitive surface area for downstream consumers.
