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

/**
 * Motion-wrapped Slot.Root for the asChild + animated path. MUST be defined
 * at module top level — defining it inside the component creates a fresh
 * component identity per render and breaks React reconciliation.
 */
const MotionSlot = m.create(Slot.Root)

/* ── Intent type ── */
const INTENTS = ["primary", "neutral", "success", "warning", "danger", "info"] as const
type Intent = (typeof INTENTS)[number]

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
          "bg-[var(--intent)] text-[var(--intent-fg)] shadow-[var(--btn-shadow)] hover:shadow-[var(--btn-shadow-hover)] hover:brightness-110 dark:hover:brightness-125",
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

/** Framer-motion event overrides that conflict with React HTML events */
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
  /** Render as child element (Radix Slot pattern) */
  asChild?: boolean
  /** Semantic color intent */
  intent?: Intent
  /** Stretch to full width of container */
  fullWidth?: boolean
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
  surface,
  iconWeight,
  radius,
  animated,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const motion = useSaasflareMotion(sf.animated, spring, disabled ?? false)

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

  const dataAttrs = {
    "data-slot": "button",
    "data-variant": resolvedVariant,
    "data-intent": resolvedIntent,
    "data-size": size,
    "data-surface": sf.surface,
    "data-radius": sf.radius,
    "data-animated": String(sf.animated),
  }

  const classes = cn(
    buttonVariants({ variant: resolvedVariant as VariantProps<typeof buttonVariants>["variant"], size }),
    fullWidth && "w-full",
    className
  )

  /* ── Slot rendering (Pattern A: animated asChild via m.create(Slot.Root)) ── */
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

  return (
    <m.button
      {...dataAttrs}
      whileHover={motion.disabled ? undefined : { scale: 1.02 }}
      whileTap={motion.disabled ? undefined : { scale: 0.97 }}
      transition={motion.transition}
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </m.button>
  )
}

export { Button, buttonVariants, type ButtonProps, type Intent }
