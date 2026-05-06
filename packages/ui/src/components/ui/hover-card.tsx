// @toreview
/**
 * @fileoverview HoverCard — premium animated hover-triggered popover card with Framer Motion spring entrance for previewing content on hover.
 * @module packages/core/components/ui/hover-card
 * @layer core
 *
 * @component
 * @example
 * import { HoverCard, HoverCardTrigger, HoverCardContent } from '@saasflare/core';
 *
 * <HoverCard>
 *   <HoverCardTrigger>Hover me</HoverCardTrigger>
 *   <HoverCardContent>
 *     <p>Preview content appears here.</p>
 *   </HoverCardContent>
 * </HoverCard>
 */
"use client"

import * as React from "react"
import { m } from "framer-motion"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { cn } from "../../lib/utils"
import { springBouncy } from "./motion-config"

function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        asChild
        {...props}
      >
        <m.div
          initial={{ opacity: 0, scale: 0.95, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={springBouncy}
          className={cn(
            "z-50 w-64 origin-[var(--radix-hover-card-content-transform-origin)] rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden",
            className
          )}
        />
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
