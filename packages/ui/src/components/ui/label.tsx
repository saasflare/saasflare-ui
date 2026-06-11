// @toreview
"use client"

/**
 * @fileoverview Label primitive — accessible form label with disabled state awareness.
 * Built on Radix UI Label. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/label
 * @layer core
 *
 * @component
 * @example
 * import { Label } from '@saasflare/ui';
 * <Label htmlFor="email">Email address</Label>
 */

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { cn } from "../../lib"

interface LabelProps
  extends Omit<React.ComponentProps<typeof LabelPrimitive.Root>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Accessible form label built on the Radix Label primitive. Dims itself when
 * the associated peer control or `data-disabled` group is disabled; associate
 * with a control via `htmlFor`.
 *
 * @component
 * @layer core
 *
 * @example
 * <Label htmlFor="email">Email address</Label>
 */
function Label({
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: LabelProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <LabelPrimitive.Root
      data-slot="label"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
