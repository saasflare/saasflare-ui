// @toreview
/**
 * @fileoverview Separator primitive — visual divider line for horizontal or vertical content separation.
 * Built on Radix UI Separator. Part of the Saasflare base component layer.
 * @module packages/core/components/ui/separator
 * @layer core
 *
 * @component
 * @example
 * import { Separator } from '@saasflare/core';
 * <Separator orientation="horizontal" />
 */
"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "../../lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
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
