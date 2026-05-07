// @toreview
/**
 * @fileoverview Spinner primitive — animated loading indicator built on the Lucide
 * Loader2 icon. Applies a continuous spin animation with accessible status role.
 * Part of the Saasflare base component layer.
 * @module packages/core/components/ui/spinner
 * @layer core
 *
 * @component
 * @example
 * import { Spinner } from '@saasflare/core';
 * <Spinner className="size-6" />
 */
"use client"

import { Loader2Icon } from "lucide-react"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

interface SpinnerProps extends Omit<React.ComponentProps<"svg">, keyof SaasflareComponentProps>, SaasflareComponentProps {}

function Spinner({ className, surface, radius, animated, ...props }: SpinnerProps) {
  const sf = useSaasflareProps({ animated })

  return (
    <Loader2Icon
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
