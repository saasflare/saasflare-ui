// @toreview
"use client"

/**
 * @fileoverview Separator primitive — visual divider line for horizontal or vertical content separation.
 * Built on Radix UI Separator. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/separator
 * @layer core
 *
 * @component
 * @example
 * import { Separator } from '@saasflare/ui';
 * <Separator orientation="horizontal" />
 */

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/**
 * Props for the {@link Separator} component. Extends the Radix Separator root
 * props with the shared Saasflare design-system axes (`surface`, `radius`,
 * `animated`, `iconWeight`).
 */
interface SeparatorProps
  extends Omit<
      React.ComponentProps<typeof SeparatorPrimitive.Root>,
      keyof SaasflareComponentProps
    >,
    SaasflareComponentProps {}

/**
 * Separator — visual divider line for separating content horizontally or vertically.
 * Built on Radix UI Separator.
 *
 * @example
 * ```tsx
 * import { Separator } from '@saasflare/ui';
 *
 * <Separator orientation="horizontal" />
 * ```
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: SeparatorProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
export type { SeparatorProps }
