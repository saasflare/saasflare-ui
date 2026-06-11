// @toreview
/**
 * @fileoverview Spinner primitive — animated loading indicator built on the
 * Phosphor CircleNotch icon. Applies a continuous spin animation with accessible
 * status role.
 * Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/spinner
 * @layer core
 *
 * @component
 * @example
 * import { Spinner } from '@saasflare/ui';
 * <Spinner className="size-6" />
 */
"use client"

import * as React from "react"

import { CircleNotchIcon } from "./phosphor"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/**
 * Props for {@link Spinner}.
 *
 * Extends the SVG element props with {@link SaasflareComponentProps}. The
 * spinner keeps the regular icon weight regardless of `iconWeight` — a
 * deliberate visual-identity exemption.
 */
interface SpinnerProps extends Omit<React.ComponentProps<"svg">, keyof SaasflareComponentProps>, SaasflareComponentProps {}

/**
 * Loading indicator — a spinning Phosphor CircleNotch with `role="status"` and
 * an accessible "Loading" label. The spin animation respects the resolved
 * `animated` axis. Size via `className` (defaults to `size-4`).
 *
 * @component
 * @layer core
 *
 * @example
 * <Spinner className="size-6" />
 */
function Spinner({ className, surface, radius, animated, iconWeight, ...props }: SpinnerProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <CircleNotchIcon
      {...props}
      role="status"
      aria-label="Loading"
      data-slot="spinner"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn("size-4", sf.animated && "animate-spin", className)}
    />
  )
}

export { Spinner, type SpinnerProps }
