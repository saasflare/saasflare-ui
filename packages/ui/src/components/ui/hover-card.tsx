// @toreview
"use client"

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
import { m } from "motion/react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springBouncy } from "./motion-config"

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

interface HoverCardContentProps
  extends Omit<React.ComponentProps<typeof HoverCardPrimitive.Content>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  surface,
  radius,
  animated,
  ...props
}: HoverCardContentProps) {
  const sf = useSaasflareProps({ surface, radius, animated })
  const motion = useSaasflareMotion(sf.animated, springBouncy)

  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        {...props}
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        asChild
      >
        <m.div
          data-surface={sf.surface}
          data-radius={sf.radius}
          data-animated={String(sf.animated)}
          initial={motion.disabled ? false : { opacity: 0, scale: 0.95, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={motion.disabled ? undefined : { opacity: 0, scale: 0.95 }}
          transition={motion.transition}
          className={cn(
            "z-50 w-64 origin-[var(--radix-hover-card-content-transform-origin)] rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden",
            className
          )}
        />
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent, type HoverCardContentProps }
