// @toreview
"use client"

/**
 * @fileoverview AspectRatio primitive — constrains content to a specified width-to-height ratio.
 * Built on Radix UI AspectRatio. Part of the Saasflare base component layer.
 * @module packages/core/components/ui/aspect-ratio
 * @layer core
 *
 * @component
 * @example
 * import { AspectRatio } from '@saasflare/core';
 * <AspectRatio ratio={16 / 9}>
 *   <img src="/image.jpg" alt="Landscape" />
 * </AspectRatio>
 */
"use client"

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }
