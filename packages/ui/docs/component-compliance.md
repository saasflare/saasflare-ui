# Component Compliance — `@saasflare/ui`

> Spec for how every visible Saasflare component integrates with `<SaasflareProvider>`.
> This document is the **single source of truth** during the v3.1.0 universal-compliance migration. Reviews validate against this matrix; deviations need explicit justification.

## Mental model — two orthogonal axes

`SaasflareComponentProps` declares three independent concerns. Each component decides which apply, independently:

**Axis 1 — Which props apply?**
- `surface` — wherever visible chrome exists (background, border)
- `radius` — wherever corners exist
- `animated` — wherever motion exists (JS or CSS)

**Axis 2 — How is motion implemented?** (only relevant when `animated` applies)
- **JS-Motion** (Framer Motion `m.*`): needs the `useSaasflareMotion` hook because JS-driven transitions can't be killed via CSS.
- **CSS-Motion**: needs only the `data-animated` attribute. The global CSS layer in [`packages/ui/styles/motion.css`](../styles/motion.css) zeroes out `animation-duration` and `transition-duration` when `data-animated="false"`.

Axis 1 decides the props API. Axis 2 decides the implementation pattern. The historical Tier A/B/C/D labels in `src/components/ui/index.ts` mix the two and don't drive compliance — see the matrix below instead.

---

## Universal contract

Every component that **renders visibly** (puts its own JSX element on the screen) extends `SaasflareComponentProps` and accepts all three props **— even if it doesn't use all of them.** Rationale: TypeScript consistency and drop-in compatibility beat strict typing. `<Spinner surface="frosted" />` doesn't break — the attribute lands on the root, no CSS selector matches, fine.

**`data-slot` is mandatory.** Every Saasflare component MUST set `data-slot="<kebab-name>"` on its root — e.g. `data-slot="checkbox"`, `data-slot="dialog-content"`. The `prefers-reduced-motion` media query in `motion.css` matches `[data-slot]` to bring OS-level reduced-motion to every Saasflare element. Without `data-slot`, the a11y layer doesn't reach that component.

**Renderless exception.** `Form`, `Field`, `AspectRatio`, `DirectionProvider` render only fragments / context wrappers. They don't extend `SaasflareComponentProps` and don't need `data-slot`.

---

## Component matrix

| # | Category | Components | `surface` | `radius` | `animated` | Pattern |
|---|---|---|---|---|---|---|
| 1 | **Full + JS-Motion** | Button, Card, Dialog, AlertDialog, Accordion, Tabs, Input, Textarea, Checkbox, Switch, Progress, Badge, Tooltip, Popover, HoverCard, Select, DropdownMenu, Sheet, Slider | ✓ | ✓ | ✓ | **A** |
| 2 | **Full + CSS-Motion** | ContextMenu, Menubar, NavigationMenu, Toggle, ToggleGroup, RadioGroup, Collapsible, ScrollArea, Toaster | ✓ | ✓ | ✓ | **B** |
| 3 | **Surface only** | Avatar, Alert, Kbd, NativeSelect, Empty, Table, Breadcrumb | ✓ | ✓ | – | **C** |
| 4 | **Motion only** | Spinner, TypewriterText, AnimatedTooltip; **Skeleton** also `radius` | – (Skel: ✓) | (Skel: ✓) | ✓ | **C** |
| 5a | **Subpath-Primitives, own motion** | see sub-table below | ✓ | ✓ | ✓ | **A** / **B** / **C** |
| 5b | **Composed-SaaS-Widgets**, no own motion | PricingCard, MetricCard, SectionCard, PageHeader, SettingsSection, EmptyState, SearchField, DataToolbar | ✓ | ✓ | – | **C-Lite** (surface + radius) |
| 6 | **Pure pass-through** | Pagination, Combobox, ButtonGroup, InputGroup, Separator, Label, Item | – | – | – | none |
| 7 | **Renderless** | Form, Field, AspectRatio, DirectionProvider | – | – | – | none |

### Cat 5a — Subpath-Primitives detail

| Component | Pattern | Reason |
|---|---|---|
| Drawer | **A** | uses vaul (Framer-based) |
| Carousel | **B** | embla-carousel + CSS transitions |
| Command | **B** | cmdk + CSS transitions |
| Sidebar | **B** | CSS-based slide animation |
| Calendar | **C** (surface + radius) | container without own motion (react-day-picker renders) |
| Chart | **C** (surface + radius) | container without own motion (recharts renders) |
| Resizable | **C** (surface + radius) | container without own motion |
| InputOTP | **C** (surface + radius) | container without own motion (input-otp renders) |

### Counts

| Category | Count |
|---|---|
| Cat 1 — Full + JS-Motion | 19 (Button + 18) |
| Cat 2 — Full + CSS-Motion | 9 |
| Cat 3 — Surface only | 7 |
| Cat 4 — Motion only | 4 |
| Cat 5a — Subpath-Primitives | 8 |
| Cat 5b — Composed-Widgets | 8 |
| Cat 6 — Pass-through | 7 |
| Cat 7 — Renderless | 4 |
| **Total** | **66** |

**Active-pattern components (Cat 1–5b):** 55. **No-pattern (Cat 6+7):** 11.

---

## Implementation patterns

### Pattern A — Full hook stack (JS-Motion via Framer)

```tsx
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springBouncy } from "./motion-config"

interface CheckboxProps
  extends Omit<React.ComponentProps<typeof CheckboxPrimitive.Root>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

function Checkbox({ className, surface, radius, animated, ...props }: CheckboxProps) {
  const sf = useSaasflareProps({ surface, radius, animated })
  const motion = useSaasflareMotion(sf.animated, springBouncy)

  return (
    <CheckboxPrimitive.Root
      {...props}
      data-slot="checkbox"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(/* unchanged tailwind */, className)}
    >
      <CheckboxPrimitive.Indicator asChild>
        <m.span
          initial={motion.disabled ? false : { scale: 0, opacity: 0 }}
          animate={motion.disabled ? false : { scale: 1, opacity: 1 }}
          exit={motion.disabled ? undefined : { scale: 0, opacity: 0 }}
          transition={motion.transition}
        >
          <CheckIcon className="size-3.5" />
        </m.span>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
```

For Button-style components with extra disablers (`disabled`, `loading`):

```tsx
const motion = useSaasflareMotion(sf.animated, spring, disabled ?? false, loading)
```

`useSaasflareMotion` accepts variadic `extraDisablers` — every truthy value forces motion off, in addition to `!animated` and `prefers-reduced-motion: reduce`.

### Pattern B — CSS-Motion (no JS hook)

```tsx
function Toggle({ className, surface, radius, animated, ...props }: ToggleProps) {
  const sf = useSaasflareProps({ surface, radius, animated })

  return (
    <TogglePrimitive.Root
      {...props}
      data-slot="toggle"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(/* tailwind transition-* utilities */, className)}
    />
  )
}
```

The global CSS layer kills `transition-duration` / `animation-duration` when `data-animated="false"`. Component stays dumb.

### Pattern C — Subset

Same as A or B, but only the applicable props are destructured and emitted as data-attrs.

**`Spinner` (Cat 4 — `animated` only):**

```tsx
function Spinner({ className, animated, ...props }: SpinnerProps) {
  const sf = useSaasflareProps({ animated })

  return (
    <span
      {...props}
      data-slot="spinner"
      data-animated={String(sf.animated)}
      className={cn(/* tailwind animate-spin */, className)}
    >
      <Loader2Icon />
    </span>
  )
}
```

**`Skeleton` (Cat 4 — `radius` + `animated`):**

```tsx
function Skeleton({ className, radius, animated, ...props }: SkeletonProps) {
  const sf = useSaasflareProps({ radius, animated })

  return (
    <div
      {...props}
      data-slot="skeleton"
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(/* tailwind animate-pulse rounded-md */, className)}
    />
  )
}
```

**Pattern C-Lite — `PricingCard` (Cat 5b — Composed, no own motion):**

```tsx
function PricingCard({ className, surface, radius, animated, ...props }: PricingCardProps) {
  // animated flows through {...props} to inner primitives (Button, Badge),
  // but isn't consumed in own render logic — this component has no own motion.
  const sf = useSaasflareProps({ surface, radius })

  return (
    <div
      {...props}
      data-slot="pricing-card"
      data-surface={sf.surface}
      data-radius={sf.radius}
      className={cn(/* tailwind border bg-card */, className)}
    />
  )
}
```

---

## Conventions

### Spread-first

`{...props}` is **always** the first attribute on the root. Explicit `data-*` and `className` come after, so Saasflare attributes win over consumer overrides. Apply uniformly across all 55 active-pattern components.

### Compound components

(Dialog, Accordion, Select, Popover, HoverCard, Tooltip, ContextMenu, Menubar, NavigationMenu, …)

- Apply the pattern to **each subcomponent that has its own visible JSX**.
- `data-surface` / `data-radius` / `data-animated` land on the **visually-rendering element** (`DialogContent`, `AccordionItem`, `PopoverContent`), **not** on the logical wrapper (`Dialog` / `DialogRoot`). Otherwise CSS selectors like `[data-surface="frosted"] [role="dialog"]` don't work — the attribute must be on the element the user sees.
- Trigger / Close / Portal-only wrappers don't get the pattern.

**Consumer API:**

```tsx
// ✅ Correct — surface on the visually-rendering subcomponent
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent surface="frosted" radius="round">
    <DialogTitle>Hello</DialogTitle>
  </DialogContent>
</Dialog>

// ❌ Wrong — Dialog root renders nothing visible, attr is lost
<Dialog surface="frosted">
  <DialogContent>...</DialogContent>
</Dialog>
```

For standalone components (Button, Checkbox, Switch, …), the root *is* visual, so the prop goes directly on the component.

---

## Helper API

### `useSaasflareMotion(animated, base?, ...extraDisablers)`

Lives in [`src/components/ui/motion-config.ts`](../src/components/ui/motion-config.ts).

```ts
interface SaasflareMotion {
  /** Spring or noMotion — drop directly onto `transition={…}`. */
  transition: Transition
  /** True when motion should be skipped — gate `whileHover`, `initial`, etc. */
  disabled: boolean
}

function useSaasflareMotion(
  animated: boolean,
  base?: Transition,           // defaults to `spring`
  ...extraDisablers: boolean[] // e.g. disabled, loading
): SaasflareMotion
```

Single tuning point: when later we differentiate spring tokens per component (`springBouncy.checkbox`, `springSnappy.dialog`), the variants live next to this hook — components don't change.

### Global CSS layer

In [`packages/ui/styles/motion.css`](../styles/motion.css):

```css
/* Provider-wide motion kill via animated={false} */
[data-animated="false"],
[data-animated="false"] *,
[data-animated="false"] *::before,
[data-animated="false"] *::after {
  animation-duration: 0ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0ms !important;
  scroll-behavior: auto !important;
}

/* OS preference */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0ms !important;
    transition-duration: 0ms !important;
  }
}
```

This makes Pattern B *automatically* compliant — no per-component code, no render conditionals.

---

## Decisions (resolved)

### `Skeleton` / `Spinner` with `animated={false}`

→ **Static.** Explicit user intent wins. Vestibular-disorder users prefer "no loading indicator" over "less aggressive indicator". No fallback pulse or half-opacity. Override per component if you need different behavior.

### `Tooltip` / `Popover` surface tuning

→ **Accept the prop, CSS layer decides.** Tooltip (Cat 1) extends `SaasflareComponentProps` fully and emits `data-surface`. How a frosted tooltip looks is a CSS question, not a TypeScript one. If the default look is bad, fix `palettes.css` / `theme.css` — *not* the Tooltip component.

### `data-animated` granularity

→ **Boolean** (`"true"` / `"false"`). The "reduced" middle state is handled by `prefers-reduced-motion: reduce` in the CSS layer. If a 3-state enum (`'on' | 'off' | 'reduced'`) becomes necessary later, it's an additive non-breaking change. Not for 3.1.0.

---

## Out of scope

- **Per-component surface variants in JSX** — belongs in CSS via `[data-surface="…"]`, not render conditionals
- **3-state `data-animated` enum** — additive future-proof, not now
- **Per-component spring tokens** (`springBouncy.checkbox`) — single tuning point is `useSaasflareMotion`, differentiate later when needed
- **Per-component unit tests** — single integration smoke test in `apps/ui` is more efficient
