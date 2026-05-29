// @toreview
"use client"

/**
 * @fileoverview Saasflare Accordion — collapsible content sections.
 * @module packages/core/components/ui/accordion
 * @layer core
 *
 * Self-contained implementation using Radix Accordion primitive directly.
 * Content fade animation respects reduced-motion preference.
 *
 * @example
 * import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@saasflare/ui";
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="faq-1">
 *     <AccordionTrigger>Is it accessible?</AccordionTrigger>
 *     <AccordionContent>Yes, it follows WAI-ARIA patterns.</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 */

import * as React from "react"
import { m } from "motion/react"
import { CaretDownIcon } from "./phosphor"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springBouncy } from "./motion-config"

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

interface AccordionItemProps
  extends Omit<React.ComponentProps<typeof AccordionPrimitive.Item>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

function AccordionItem({
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: AccordionItemProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <AccordionPrimitive.Item
      {...props}
      data-slot="accordion-item"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn("border-b last:border-b-0", className)}
    />
  )
}

/**
 * Accordion trigger with animated chevron indicator.
 *
 * @component
 * @layer core
 */
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const sf = useSaasflareProps()
  const motion = useSaasflareMotion(sf.animated, springBouncy)

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        {...props}
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 cursor-pointer items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className
        )}
      >
        {children}
        <m.div
          className="pointer-events-none shrink-0 translate-y-0.5 text-muted-foreground"
          animate={{ rotate: 0 }}
          transition={motion.transition}
        >
          <CaretDownIcon weight={sf.iconWeight} className="size-4" />
        </m.div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

/**
 * Accordion content panel with fade-in animation.
 *
 * @component
 * @layer core
 */
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const sf = useSaasflareProps()
  const motion = useSaasflareMotion(sf.animated, { delay: 0.1, duration: 0.2 })

  return (
    <AccordionPrimitive.Content
      {...props}
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    >
      <m.div
        initial={motion.disabled ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={motion.transition}
        className={cn("pt-0 pb-4", className)}
      >
        {children}
      </m.div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, type AccordionItemProps }
