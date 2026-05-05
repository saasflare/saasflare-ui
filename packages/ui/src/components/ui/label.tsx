// @toreview
/**
 * @fileoverview Label primitive — accessible form label with disabled state awareness.
 * Built on Radix UI Label. Part of the Saasflare base component layer.
 * @module packages/core/components/ui/label
 * @layer core
 *
 * @component
 * @example
 * import { Label } from '@saasflare/core';
 * <Label htmlFor="email">Email address</Label>
 */
"use client"

import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "../../lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
