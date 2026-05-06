// @toreview
/**
 * @fileoverview Popover — premium animated popover with Framer Motion spring entrance for tooltips, menus, and floating content panels.
 * @module packages/core/components/ui/popover
 * @layer core
 *
 * @component
 * @example
 * import { Popover, PopoverTrigger, PopoverContent } from '@saasflare/core';
 *
 * <Popover>
 *   <PopoverTrigger>Open</PopoverTrigger>
 *   <PopoverContent>
 *     <p>Popover content here.</p>
 *   </PopoverContent>
 * </Popover>
 */
"use client"

import * as React from "react"
import { m } from "motion/react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "../../lib/utils"
import { springBouncy } from "./motion-config"

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        asChild
        {...props}
      >
        <m.div
          initial={{ opacity: 0, scale: 0.95, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -4 }}
          transition={springBouncy}
          className={cn(
            "z-50 w-72 origin-[var(--radix-popover-content-transform-origin)] rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden",
            className
          )}
        />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
