// @toreview
"use client"

/**
 * @fileoverview AspectRatio primitive — constrains content to a specified width-to-height ratio.
 * Built on Radix UI AspectRatio. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/aspect-ratio
 * @layer core
 *
 * @component
 * @example
 * import { AspectRatio } from '@saasflare/ui';
 * <AspectRatio ratio={16 / 9}>
 *   <img src="/image.jpg" alt="Landscape" />
 * </AspectRatio>
 */

import * as React from "react"
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/**
 * Props for {@link AspectRatio}.
 *
 * Extends the Radix AspectRatio root props plus the Saasflare theme axes.
 * AspectRatio is a layout-only primitive (no surface/border/background/icons),
 * so the contract axes are accepted for API consistency and emitted as data
 * attributes, but do not alter the rendered box.
 */
interface AspectRatioProps
  extends Omit<
      React.ComponentProps<typeof AspectRatioPrimitive.Root>,
      keyof SaasflareComponentProps
    >,
    SaasflareComponentProps {}

/**
 * Constrains its children to a fixed width-to-height ratio.
 *
 * @example
 * <AspectRatio ratio={16 / 9}>
 *   <img src="/image.jpg" alt="Landscape" />
 * </AspectRatio>
 */
function AspectRatio({
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: AspectRatioProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <AspectRatioPrimitive.Root
      data-slot="aspect-ratio"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      {...props}
    />
  )
}

export { AspectRatio }
