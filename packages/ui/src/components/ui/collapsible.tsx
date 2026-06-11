// @toreview
"use client"

/**
 * @fileoverview Collapsible primitive — expandable/collapsible content region with trigger control.
 * Built on Radix UI Collapsible. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/collapsible
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

/**
 * Props for {@link CollapsibleContent}. Extends the Radix Collapsible content
 * props with the Saasflare theming axes (`surface`, `radius`, `animated`,
 * `iconWeight`).
 */
interface CollapsibleContentProps
  extends Omit<React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Expandable content region toggled by a trigger. Root of the composition —
 * owns open state and wires {@link CollapsibleTrigger} and
 * {@link CollapsibleContent} together. Use for a single show/hide section;
 * for stacked exclusive sections reach for Accordion.
 *
 * @component
 * @layer core
 */
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

/**
 * Button that toggles the collapsible region open and closed.
 *
 * @component
 * @layer core
 */
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

/**
 * The content region revealed while the collapsible is open. Resolves
 * `surface`/`radius`/`animated` against the <SaasflareProvider> context and
 * exposes them as data attributes for CSS-driven styling.
 *
 * @component
 * @layer core
 */
function CollapsibleContent({
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: CollapsibleContentProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

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
