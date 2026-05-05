// @toreview
/**
 * @fileoverview Collapsible primitive — expandable/collapsible content region with trigger control.
 * Built on Radix UI Collapsible. Part of the Saasflare base component layer.
 * @module packages/core/components/ui/collapsible
 * @layer core
 *
 * @component
 * @example
 * import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@saasflare/core';
 * <Collapsible>
 *   <CollapsibleTrigger>Toggle</CollapsibleTrigger>
 *   <CollapsibleContent>Hidden content revealed on toggle.</CollapsibleContent>
 * </Collapsible>
 */
"use client"

import { Collapsible as CollapsiblePrimitive } from "radix-ui"

function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
