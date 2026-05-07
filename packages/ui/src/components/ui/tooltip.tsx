// @toreview
"use client"

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
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springBouncy } from "./motion-config"

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

interface TooltipContentProps
  extends Omit<React.ComponentProps<typeof TooltipPrimitive.Content>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

function TooltipContent({
  className,
  sideOffset = 6,
  children,
  surface,
  radius,
  animated,
  ...props
}: TooltipContentProps) {
  const sf = useSaasflareProps({ surface, radius, animated })
  const motion = useSaasflareMotion(sf.animated, springBouncy)

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        {...props}
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        asChild
      >
        <m.div
          data-surface={sf.surface}
          data-radius={sf.radius}
          data-animated={String(sf.animated)}
          initial={motion.disabled ? false : { opacity: 0, scale: 0.92, y: 2 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={motion.disabled ? undefined : { opacity: 0, scale: 0.92 }}
          transition={motion.transition}
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

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, type TooltipContentProps }
