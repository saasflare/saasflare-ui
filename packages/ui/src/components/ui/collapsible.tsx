// @toreview
"use client"

/**
 * @fileoverview Collapsible primitive — expandable/collapsible content region with trigger control.
 * Built on Radix UI Collapsible. Part of the Saasflare base component layer.
 * @module packages/core/components/ui/collapsible
 * @layer core
 *
 * @component
 * @example
 * import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@saasflare/ui';
 * <Collapsible>
 *   <CollapsibleTrigger>Toggle</CollapsibleTrigger>
 *   <CollapsibleContent>Hidden content revealed on toggle.</CollapsibleContent>
 * </Collapsible>
 */

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

interface CollapsibleContentProps
  extends Omit<React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

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
  surface,
  radius,
  animated,
  ...props
}: CollapsibleContentProps) {
  const sf = useSaasflareProps({ surface, radius, animated })

  return (
    <CollapsiblePrimitive.CollapsibleContent
      {...props}
      data-slot="collapsible-content"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent, type CollapsibleContentProps }
