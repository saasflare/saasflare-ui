// @toreview
/**
 * @fileoverview Tooltip — animated contextual hint with spring entrance, arrow support, and configurable delay.
 * @module packages/core/components/ui/tooltip
 * @layer core
 *
 * @component
 * @example
 * import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@saasflare/core';
 * <TooltipProvider>
 *   <Tooltip>
 *     <TooltipTrigger>Hover me</TooltipTrigger>
 *     <TooltipContent>Helpful hint</TooltipContent>
 *   </Tooltip>
 * </TooltipProvider>
 */
"use client"

import * as React from "react"
import { m, AnimatePresence } from "motion/react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "../../lib/utils"
import { springBouncy } from "./motion-config"

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        asChild
        {...props}
      >
        <m.div
          initial={{ opacity: 0, scale: 0.92, y: 2 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={springBouncy}
          className={cn(
            "z-50 w-fit overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md",
            className
          )}
        >
          {children}
        </m.div>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
