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
 * import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@saasflare/core";
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="faq-1">
 *     <AccordionTrigger>Is it accessible?</AccordionTrigger>
 *     <AccordionContent>Yes, it follows WAI-ARIA patterns.</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 */

import * as React from "react"
import { m } from "framer-motion"
import { ChevronDownIcon } from "lucide-react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { cn } from "../../lib"
import { springBouncy, useReducedMotion } from "./motion-config"

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
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
  const reduced = useReducedMotion()

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 cursor-pointer items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <m.div
          className="pointer-events-none shrink-0 translate-y-0.5 text-muted-foreground"
          animate={{ rotate: 0 }}
          transition={reduced ? { duration: 0 } : springBouncy}
        >
          <ChevronDownIcon className="size-4" />
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
  const reduced = useReducedMotion()

  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <m.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduced ? { duration: 0 } : { delay: 0.1, duration: 0.2 }}
        className={cn("pt-0 pb-4", className)}
      >
        {children}
      </m.div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
