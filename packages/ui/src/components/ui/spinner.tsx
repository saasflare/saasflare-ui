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

interface SpinnerProps extends Omit<React.ComponentProps<"svg">, keyof SaasflareComponentProps>, SaasflareComponentProps {}

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
