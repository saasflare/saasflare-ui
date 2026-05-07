// @toreview
"use client"

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
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springBouncy } from "./motion-config"

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

interface PopoverContentProps
  extends Omit<React.ComponentProps<typeof PopoverPrimitive.Content>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  surface,
  radius,
  animated,
  ...props
}: PopoverContentProps) {
  const sf = useSaasflareProps({ surface, radius, animated })
  const motion = useSaasflareMotion(sf.animated, springBouncy)

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        {...props}
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        asChild
      >
        <m.div
          data-surface={sf.surface}
          data-radius={sf.radius}
          data-animated={String(sf.animated)}
          initial={motion.disabled ? false : { opacity: 0, scale: 0.95, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={motion.disabled ? undefined : { opacity: 0, scale: 0.95, y: -4 }}
          transition={motion.transition}
          className={cn(
            "z-50 w-72 origin-[var(--radix-popover-content-transform-origin)] rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden",
            className
          )}
        />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, type PopoverContentProps }
