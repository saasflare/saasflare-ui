// @toreview
/**
 * @fileoverview Spinner primitive — animated loading indicator built on the
 * Phosphor CircleNotch icon. Applies a continuous spin animation with accessible
 * status role.
 * Part of the Saasflare base component layer.
 * @module packages/core/components/ui/spinner
 * @layer core
 *
 * @component
 * @example
 * import { Spinner } from '@saasflare/ui';
 * <Spinner className="size-6" />
 */
"use client"

import { CircleNotchIcon } from "./phosphor"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

interface SpinnerProps extends Omit<React.ComponentProps<"svg">, keyof SaasflareComponentProps>, SaasflareComponentProps {}

function Spinner({ className, surface, radius, animated, ...props }: SpinnerProps) {
  const sf = useSaasflareProps({ animated })

  return (
    <CircleNotchIcon
      {...props}
      role="status"
      aria-label="Loading"
      data-slot="spinner"
      data-animated={String(sf.animated)}
      className={cn("size-4 animate-spin", className)}
    />
  )
}

export { Spinner, type SpinnerProps }
