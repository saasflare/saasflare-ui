// @toreview
"use client"

/**
 * @fileoverview Tooltip — animated contextual hint with spring entrance, arrow support, and configurable delay.
 * @module packages/ui/components/ui/tooltip
 * @layer core
 *
 * @component
 * @example
 * import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@saasflare/ui';
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
            "z-50 w-fit rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md",
            className
          )}
        >
          {children}
        </m.div>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

interface TooltipArrowProps
  extends React.ComponentProps<typeof TooltipPrimitive.Arrow> {}

/**
 * Arrow connecting the tooltip to its trigger.
 *
 * Renders as a child of `<TooltipContent>` (consumes Popper context) and rides
 * the existing spring entrance because it lives inside the animated panel — no
 * extra motion wiring is needed, and reduced-motion / `animated=false` gating is
 * inherited from the content. Fill follows the `bg-primary` token via
 * `fill-primary` to match the tooltip body, so it stays palette- and
 * theme-reactive. Override the fill with `className` under custom surfaces.
 *
 * @component
 * @layer core
 * @example
 * <TooltipContent>
 *   Copy link
 *   <TooltipArrow />
 * </TooltipContent>
 */
function TooltipArrow({ className, ...props }: TooltipArrowProps) {
  return (
    <TooltipPrimitive.Arrow
      data-slot="tooltip-arrow"
      width={11}
      height={5}
      className={cn("fill-primary", className)}
      {...props}
    />
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipArrow, type TooltipContentProps, type TooltipArrowProps }
