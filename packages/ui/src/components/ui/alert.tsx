// @toreview
"use client"

/**
 * @fileoverview Saasflare Alert — contextual feedback with intent support.
 * @module packages/core/components/ui/alert
 * @layer core
 *
 * Fully owned Saasflare implementation. Does NOT import from ui/.
 * Always renders with a "soft" visual treatment — no variant axis needed.
 * Intent controls the color: neutral (default), info, success, warning, danger.
 *
 * @example
 * import { Alert, AlertTitle, AlertDescription } from "@saasflare/core";
 * import { InfoIcon } from "./phosphor";
 *
 * <Alert intent="info">
 *   <InfoIcon />
 *   <AlertTitle>Heads up!</AlertTitle>
 *   <AlertDescription>This is an informational alert.</AlertDescription>
 * </Alert>
 */

import * as React from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import type { Intent } from "./button"

/** Intent-specific styles for the alert soft treatment */
const INTENT_STYLES: Record<string, string> = {
  neutral: "bg-card text-card-foreground border-border",
  primary: "bg-[var(--intent)]/10 text-[var(--intent)] border-[var(--intent)]/20 *:data-[slot=alert-description]:text-[var(--intent)]/80",
  info: "bg-[var(--intent)]/10 text-[var(--intent)] border-[var(--intent)]/20 *:data-[slot=alert-description]:text-[var(--intent)]/80",
  success: "bg-[var(--intent)]/10 text-[var(--intent)] border-[var(--intent)]/20 *:data-[slot=alert-description]:text-[var(--intent)]/80",
  warning: "bg-[var(--intent)]/10 text-[var(--intent)] border-[var(--intent)]/20 *:data-[slot=alert-description]:text-[var(--intent)]/80",
  danger: "bg-[var(--intent)]/10 text-[var(--intent)] border-[var(--intent)]/20 *:data-[slot=alert-description]:text-[var(--intent)]/80",
}

/** Props for the Saasflare Alert component */
interface AlertProps extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>, SaasflareComponentProps {
  /** Semantic color intent */
  intent?: Intent | "neutral"
  /**
   * Legacy variant prop for backward compatibility.
   * @deprecated Use `intent` instead. "destructive" maps to intent="danger".
   */
  variant?: "default" | "destructive"
}

/**
 * Contextual alert banner with intent-based coloring.
 *
 * @component
 * @layer core
 *
 * @param {string} intent - Color intent: "neutral" | "primary" | "info" | "success" | "warning" | "danger"
 *
 * @example
 * <Alert intent="success">
 *   <CheckIcon />
 *   <AlertTitle>Saved!</AlertTitle>
 *   <AlertDescription>Your changes have been saved.</AlertDescription>
 * </Alert>
 *
 * @example
 * // Legacy API (deprecated but supported)
 * <Alert variant="destructive">
 *   <AlertTitle>Error</AlertTitle>
 *   <AlertDescription>Something went wrong.</AlertDescription>
 * </Alert>
 */
function Alert({
  className,
  intent: intentProp,
  variant,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: AlertProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  /* ── Backward compat: map legacy variant to intent ── */
  let resolvedIntent: string = intentProp ?? "neutral"
  if (!intentProp && variant === "destructive") {
    resolvedIntent = "danger"
  }

  const intentStyle = INTENT_STYLES[resolvedIntent] ?? INTENT_STYLES.neutral

  return (
    <div
      {...props}
      data-slot="alert"
      data-intent={resolvedIntent !== "neutral" ? resolvedIntent : undefined}
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      role="alert"
      className={cn(
        "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
        intentStyle,
        className
      )}
    />
  )
}

/**
 * Alert title text.
 *
 * @component
 * @layer core
 */
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

/**
 * Alert description text.
 *
 * @component
 * @layer core
 */
function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, type AlertProps }
