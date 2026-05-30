// @toreview
"use client"

/**
 * @fileoverview Saasflare Badge — status indicator with intent support.
 * @module packages/core/components/ui/badge
 * @layer core
 *
 * Fully owned Saasflare implementation. Does NOT import from ui/.
 * Supports intent system and optional hover animation with reduced-motion.
 *
 * @example
 * import { Badge } from "@saasflare/ui";
 *
 * <Badge>Default</Badge>
 * <Badge intent="success" variant="soft">Active</Badge>
 * <Badge intent="danger" variant="outline" size="sm">Error</Badge>
 */

import * as React from "react"
import { m } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"
import * as Slot from "@radix-ui/react-slot"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, spring } from "./motion-config"
import type { Intent } from "./button"

/* ── Backward-compat variant mapping ── */
const LEGACY_VARIANT_MAP: Record<string, { variant: string; intent?: Intent }> = {
  default: { variant: "solid", intent: "primary" },
  destructive: { variant: "solid", intent: "danger" },
  secondary: { variant: "soft", intent: "neutral" },
}

/**
 * Badge variant definitions.
 *
 * Axes:
 *   variant — visual treatment: solid, soft, outline
 *   size    — sm, md
 */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        solid:
          "bg-[var(--intent)] text-[var(--intent-fg)] [a&]:hover:brightness-110",
        soft:
          "bg-[var(--intent)]/15 text-[var(--intent-text)] [a&]:hover:bg-[var(--intent)]/25 dark:bg-[var(--intent)]/20 dark:hover:bg-[var(--intent)]/30",
        outline:
          "border-[var(--intent-text)]/30 text-[var(--intent-text)] [a&]:hover:bg-[var(--intent-text)]/10",
      },
      size: {
        sm: "px-1.5 py-px text-[10px]",
        md: "px-2 py-0.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  }
)

/** Props for the Saasflare Badge component */
interface BadgeProps
  extends Omit<
      React.ComponentProps<"span">,
      "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | keyof SaasflareComponentProps
    >,
    VariantProps<typeof badgeVariants>,
    SaasflareComponentProps {
  /** Render as child element (Radix Slot pattern) */
  asChild?: boolean
  /** Semantic color intent */
  intent?: Intent
}

/**
 * Badge for status, labels, and counts with intent-based coloring.
 *
 * @component
 * @layer core
 *
 * @param {string} variant - Visual treatment: "solid" | "soft" | "outline"
 * @param {string} intent - Color intent: "primary" | "neutral" | "success" | "warning" | "danger" | "info"
 * @param {string} size - Badge size: "sm" | "md"
 * @param {boolean} asChild - Render as child element (Slot pattern)
 *
 * @example
 * <Badge intent="success" variant="soft">Active</Badge>
 *
 * @example
 * // Legacy API (deprecated but supported)
 * <Badge variant="destructive">Error</Badge>
 */
function Badge({
  className,
  variant: variantProp = "solid",
  size = "md",
  intent: intentProp = "primary",
  asChild = false,
  surface,
  radius,
  animated,
  ...props
}: BadgeProps) {
  const sf = useSaasflareProps({ surface, radius, animated })
  const motion = useSaasflareMotion(sf.animated, spring)

  /* ── Backward compat: map legacy variant names ── */
  let resolvedVariant = variantProp as string
  let resolvedIntent = intentProp

  const legacy = LEGACY_VARIANT_MAP[variantProp as string]
  if (legacy) {
    resolvedVariant = legacy.variant
    if (legacy.intent) {
      resolvedIntent = legacy.intent
    }
  }

  if (asChild) {
    return (
      <Slot.Root
        {...props}
        data-slot="badge"
        data-variant={resolvedVariant}
        data-intent={resolvedIntent}
        data-surface={sf.surface}
        data-radius={sf.radius}
        data-animated={String(sf.animated)}
        className={cn(badgeVariants({ variant: resolvedVariant as VariantProps<typeof badgeVariants>["variant"], size }), className)}
      />
    )
  }

  return (
    <m.span
      {...props}
      data-slot="badge"
      data-variant={resolvedVariant}
      data-intent={resolvedIntent}
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      whileHover={motion.disabled ? undefined : { scale: 1.05 }}
      transition={motion.transition}
      className={cn(badgeVariants({ variant: resolvedVariant as VariantProps<typeof badgeVariants>["variant"], size }), className)}
    />
  )
}

export { Badge, badgeVariants, type BadgeProps }
