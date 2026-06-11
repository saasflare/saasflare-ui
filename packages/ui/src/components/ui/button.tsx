// @toreview
"use client"

/**
 * @fileoverview Saasflare Button — primary interactive component.
 * @module packages/ui/components/ui/button
 * @package ui
 *
 * 3-axis variant system: variant × intent × size.
 * Extends {@link SaasflareComponentProps} so `surface` and `animated` can be
 * supplied per-instance or inherited from <SaasflareProvider>.
 *
 * Precedence for resolved theme props: component prop > provider context > hardcoded default.
 *
 * Stateful concerns (loading, async pending) live in
 * {@link StatefulButton} — this file stays purely presentational.
 *
 * @example
 * import { Button } from "@saasflare/ui";
 *
 * <Button>Default</Button>
 * <Button variant="solid" intent="success">Save</Button>
 * <Button variant="outline" intent="danger" size="sm">Delete</Button>
 * <Button surface="glass">Inherits glass surface</Button>
 * <Button animated={false}>No motion</Button>
 * <Button variant="shadow">Elevated Shadow</Button>
 * <Button variant="ghost" size="icon"><MagnifyingGlassIcon /></Button>
 */

import * as React from "react"
import { m } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"
import * as Slot from "@radix-ui/react-slot"
import { cn } from "../../lib"
import {
  useSaasflareProps,
  type SaasflareComponentProps,
} from "../../providers"
import { spring, useSaasflareMotion } from "./motion-config"
import { CircleNotchIcon } from "./phosphor"

// React-style dev warnings: the consumer's bundler replaces process.env.NODE_ENV.
declare const process: { readonly env: { readonly NODE_ENV?: string } }

/**
 * Motion-wrapped Slot.Root for the asChild + animated path. MUST be defined
 * at module top level — defining it inside the component creates a fresh
 * component identity per render and breaks React reconciliation.
 */
const MotionSlot = m.create(Slot.Root)

/* ── Intent type ── */
const INTENTS = ["primary", "neutral", "success", "warning", "danger", "info"] as const
/** Semantic color intent of a {@link Button} — emitted as `data-intent` and resolved to the `--intent` CSS tokens by the theme. */
type Intent = (typeof INTENTS)[number]

/**
 * Where the loading spinner renders relative to the label.
 *
 * @example
 * <Button isLoading spinnerPlacement="end">Saving…</Button>
 */
type SpinnerPlacement = "start" | "end"

/**
 * Maps a dimensional `size` to its square icon-button counterpart, used when
 * `isIconOnly` is set and the consumer has not already passed an `icon*` size.
 * `xl` has no `icon-xl` token in the cva, so it clamps to `icon-lg`.
 */
const ICON_ONLY_SIZE_MAP = {
  xs: "icon-xs",
  sm: "icon-sm",
  md: "icon",
  lg: "icon-lg",
  xl: "icon-lg",
} as const

/* ── Backward-compat variant mapping ── */
const LEGACY_VARIANT_MAP: Record<string, { variant: string; intent?: Intent }> = {
  default: { variant: "solid", intent: "primary" },
  destructive: { variant: "solid", intent: "danger" },
  secondary: { variant: "soft", intent: "neutral" },
}

/**
 * Button variant definitions using the 3-axis system.
 *
 * Axes:
 *   variant — visual treatment: solid, soft, outline, ghost, link, glass, clay, shadow
 *   intent  — color intent via data-intent attribute + CSS tokens
 *   size    — dimensional: xs, sm, md, lg, xl, icon, icon-xs, icon-sm, icon-lg
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        solid:
          "bg-[var(--intent)] text-[var(--intent-fg)] shadow-xs hover:brightness-110 dark:hover:brightness-125",
        soft:
          "bg-[var(--intent)]/15 text-[var(--intent-text)] hover:bg-[var(--intent)]/25 dark:bg-[var(--intent)]/20 dark:hover:bg-[var(--intent)]/30",
        outline:
          "border border-[var(--intent-text)]/30 text-[var(--intent-text)] shadow-xs hover:bg-[var(--intent-text)]/10 dark:border-[var(--intent-text)]/40 dark:hover:bg-[var(--intent-text)]/15",
        ghost:
          "text-[var(--intent-text)] hover:bg-[var(--intent-text)]/10 dark:hover:bg-[var(--intent-text)]/15",
        link:
          "text-[var(--intent-text)] underline-offset-4 hover:underline",
        glass:
          "bg-[var(--surface-bg)] text-[var(--intent-text)] border border-[var(--surface-border)] [backdrop-filter:var(--surface-backdrop)] [-webkit-backdrop-filter:var(--surface-backdrop)] shadow-[var(--surface-shadow)] hover:brightness-110 dark:hover:brightness-125",
        clay:
          "bg-[var(--intent)] text-[var(--intent-fg)] shadow-[var(--surface-shadow)] hover:brightness-110 active:translate-y-px dark:hover:brightness-125",
        shadow:
          "bg-[var(--intent)] text-[var(--intent-fg)] shadow-[0_8px_24px_-6px_oklch(from_var(--intent)_l_c_h_/_0.5)] hover:shadow-[0_12px_32px_-6px_oklch(from_var(--intent)_l_c_h_/_0.6)] hover:brightness-110 dark:hover:brightness-125",
      },
      size: {
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        md: "h-9 px-4 py-2 has-[>svg]:px-3",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-lg px-8 text-base has-[>svg]:px-5 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  }
)

/** Motion event overrides that conflict with React HTML events */
type MotionConflicts = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"

/**
 * Props for the Saasflare Button component.
 *
 * Extends {@link SaasflareComponentProps} to accept `surface` and `animated`
 * overrides that are resolved against the <SaasflareProvider> context.
 */
interface ButtonProps
  extends Omit<React.ComponentProps<"button">, MotionConflicts>,
    VariantProps<typeof buttonVariants>,
    SaasflareComponentProps {
  /**
   * Render as child element (Radix Slot pattern). Mutually exclusive with the
   * presentational slot props below — when `asChild` is set they are ignored
   * (dev-only `console.warn`) since a Slot cannot own injected DOM children.
   */
  asChild?: boolean
  /** Semantic color intent */
  intent?: Intent
  /** Stretch to full width of container */
  fullWidth?: boolean

  // ── Presentational slots (additive) ──
  /**
   * Node rendered before the label (e.g. a leading icon). Ignored when `asChild`.
   * Intended for non-interactive adornments; mark meaningful icons `aria-hidden`
   * yourself if they are decorative.
   */
  startContent?: React.ReactNode
  /**
   * Node rendered after the label (e.g. a trailing icon). Ignored when `asChild`.
   * Intended for non-interactive adornments.
   */
  endContent?: React.ReactNode
  /**
   * Presentational loading flag. Renders a hardcoded-regular `CircleNotch`
   * spinner, forces `disabled`, sets `aria-busy="true"`, and disables motion.
   * This is the DUMB flag you flip yourself; for promise/async orchestration
   * reach for {@link StatefulButton}.
   *
   * @default false
   */
  isLoading?: boolean
  /**
   * Spinner side while `isLoading`. Replaces `startContent` (start) or
   * `endContent` (end); the opposite slot still renders its content. No-op when
   * `isLoading` is false.
   *
   * @default "start"
   */
  spinnerPlacement?: SpinnerPlacement
  /**
   * Convenience: square icon button. Maps the resolved `size` to its paired
   * icon size token for the cva call only (`xs→icon-xs`, `sm→icon-sm`,
   * `md→icon`, `lg→icon-lg`, `xl→icon-lg`). If an `icon*` size is already
   * passed, that wins. Icon-only buttons require an accessible name — pass
   * `aria-label` (dev-only warn otherwise). Ignored when `asChild`.
   *
   * @default false
   */
  isIconOnly?: boolean
}

/**
 * Primary interactive button with motion and intent support.
 *
 * Resolves `surface` and `animated` via {@link useSaasflareProps} with the
 * precedence: component prop > <SaasflareProvider> context > hardcoded default.
 *
 * When no explicit `variant` is set and the resolved surface is `"glass"` or
 * `"clay"`, the button promotes itself to that matching variant. An explicit
 * `variant` prop always wins over the surface-based promotion.
 *
 * For loading / pending states use {@link StatefulButton}.
 *
 * @component
 * @layer ui
 *
 * @param {string} variant - Visual treatment: "solid" | "soft" | "outline" | "ghost" | "link" | "glass" | "clay" | "shadow"
 * @param {string} intent - Color intent: "primary" | "neutral" | "success" | "warning" | "danger" | "info"
 * @param {string} size - Button size: "xs" | "sm" | "md" | "lg" | "xl" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"
 * @param {string} surface - Surface style override: "flat" | "glass" | "clay" (inherits from provider when omitted)
 * @param {string} radius - Radius preset override: "sharp" | "soft" | "rounded" | "pill" (inherits from provider when omitted)
 * @param {string} iconWeight - Phosphor icon weight override: "regular" | "bold" | "fill" | "duotone" (inherits from provider when omitted)
 * @param {boolean} animated - Gate motion effects (inherits from provider when omitted)
 * @param {boolean} fullWidth - Stretches to container width
 * @param {boolean} asChild - Render as child element (Slot pattern)
 *
 * @example
 * // Solid primary (default)
 * <Button>Save Changes</Button>
 *
 * @example
 * // Outline danger
 * <Button variant="outline" intent="danger">Delete Account</Button>
 *
 * @example
 * // Inherits surface from provider — auto-promotes to glass variant
 * <SaasflareProvider surface="glass"><Button>Frosted</Button></SaasflareProvider>
 *
 * @example
 * // Icon button
 * <Button variant="ghost" size="icon"><SettingsIcon /></Button>
 *
 * @example
 * // Leading + trailing icon slots
 * <Button startContent={<ArrowLeftIcon />} endContent={<ArrowRightIcon />}>
 *   Navigate
 * </Button>
 *
 * @example
 * // Presentational loading flag (dumb): you flip it yourself
 * <Button isLoading>Saving…</Button>
 * <Button isLoading spinnerPlacement="end" endContent={<ArrowRightIcon />}>Next</Button>
 *
 * @example
 * // Square icon-only button — aria-label REQUIRED for an accessible name
 * <Button isIconOnly aria-label="Search"><MagnifyingGlassIcon /></Button>
 *
 * @example
 * // Legacy API (deprecated but supported)
 * <Button variant="destructive">Delete</Button>
 */
function Button({
  className,
  variant: variantProp,
  size = "md",
  intent: intentProp = "primary",
  asChild = false,
  fullWidth = false,
  startContent,
  endContent,
  isLoading = false,
  spinnerPlacement = "start",
  isIconOnly = false,
  surface,
  iconWeight,
  radius,
  animated,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  /* ── Loading is purely presentational, but it gates disabled + motion ── */
  const busy = isLoading === true
  const effectiveDisabled = (disabled ?? false) || busy
  const motion = useSaasflareMotion(sf.animated, spring, effectiveDisabled)

  /* ── Dev-only guidance for asChild + presentational props and a11y ── */
  if (process.env.NODE_ENV !== "production") {
    if (asChild && (startContent || endContent || busy || isIconOnly)) {
      console.warn(
        "[Saasflare][Button] `startContent`, `endContent`, `isLoading`, and `isIconOnly` are ignored when `asChild` is set — a Slot cannot own injected DOM children. Compose these inside the child element instead.",
      )
    }
    if (
      isIconOnly &&
      props["aria-label"] === undefined &&
      props["aria-labelledby"] === undefined
    ) {
      console.warn(
        "[Saasflare][Button] `isIconOnly` buttons need an accessible name. Pass `aria-label` (or `aria-labelledby`).",
      )
    }
  }

  /* ── Surface → variant promotion (only when variant is not explicit) ── */
  const effectiveVariant: string =
    variantProp ??
    (sf.surface === "glass" ? "glass" : sf.surface === "clay" ? "clay" : "solid")

  /* ── Backward compat: map legacy variant names ── */
  let resolvedVariant = effectiveVariant
  let resolvedIntent = intentProp

  const legacy = LEGACY_VARIANT_MAP[effectiveVariant]
  if (legacy) {
    resolvedVariant = legacy.variant
    if (legacy.intent) {
      resolvedIntent = legacy.intent
    }
  }

  /* ── isIconOnly: remap a dimensional size to its icon counterpart for the
   * cva call only. A consumer-supplied `icon*` size always wins; the `size`
   * prop the consumer sees is never mutated. ── */
  const isIconSize = typeof size === "string" && size.startsWith("icon")
  const resolvedSize =
    isIconOnly && !isIconSize
      ? ICON_ONLY_SIZE_MAP[size as keyof typeof ICON_ONLY_SIZE_MAP] ?? size
      : size

  const dataAttrs = {
    "data-slot": "button",
    "data-variant": resolvedVariant,
    "data-intent": resolvedIntent,
    "data-size": size,
    "data-surface": sf.surface,
    "data-radius": sf.radius,
    "data-animated": String(sf.animated),
    "data-loading": String(busy),
    "data-icon-only": String(isIconOnly),
  }

  const classes = cn(
    buttonVariants({
      variant: resolvedVariant as VariantProps<typeof buttonVariants>["variant"],
      size: resolvedSize as VariantProps<typeof buttonVariants>["size"],
    }),
    fullWidth && "w-full",
    className
  )

  /* ── Slot rendering (Pattern A: animated asChild via m.create(Slot.Root)).
   * Presentational props are intentionally ignored here (dev-warned above);
   * a Slot forwards to a single child and cannot own injected content. ── */
  if (asChild) {
    return (
      <MotionSlot
        {...props}
        {...dataAttrs}
        whileHover={motion.disabled ? undefined : { scale: 1.02 }}
        whileTap={motion.disabled ? undefined : { scale: 0.97 }}
        transition={motion.transition}
        className={classes}
      >
        {children}
      </MotionSlot>
    )
  }

  /* ── Spinner: HARDCODED regular weight per the documented iconWeight
   * Spinner/Button-loading visual-identity exemption — do NOT forward
   * sf.iconWeight here. (consumer startContent/endContent icons keep normal
   * iconWeight propagation via provider context.) ── */
  const spinner = (
    <CircleNotchIcon weight="regular" aria-hidden="true" className="animate-spin" />
  )

  /* ── Compose slot children. When busy, the spinner replaces the slot on the
   * placement side; the opposite slot still renders its content. ── */
  const leading = busy && spinnerPlacement !== "end" ? spinner : startContent
  const trailing = busy && spinnerPlacement === "end" ? spinner : endContent
  const body = (
    <>
      {leading}
      {children}
      {trailing}
    </>
  )

  return (
    <m.button
      {...dataAttrs}
      whileHover={motion.disabled ? undefined : { scale: 1.02 }}
      whileTap={motion.disabled ? undefined : { scale: 0.97 }}
      transition={motion.transition}
      className={classes}
      aria-busy={busy || undefined}
      disabled={effectiveDisabled}
      {...props}
    >
      {body}
    </m.button>
  )
}

export { Button, buttonVariants, type ButtonProps, type Intent, type SpinnerPlacement }
