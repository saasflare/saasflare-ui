// @toreview
"use client"

/**
 * @fileoverview Popover — premium animated popover with Motion spring entrance for tooltips, menus, and floating content panels.
 * @module packages/ui/components/ui/popover
 * @layer core
 *
 * @component
 * @example
 * import { Popover, PopoverTrigger, PopoverContent } from '@saasflare/ui';
 *
 * <Popover>
 *   <PopoverTrigger>Open</PopoverTrigger>
 *   <PopoverContent>
 *     <p>Popover content here.</p>
 *   </PopoverContent>
 * </Popover>
 */

import * as React from "react"
import { m } from "motion/react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springBouncy } from "./motion-config"

/**
 * Floating content panel anchored to a trigger element, opened on click.
 * Root of the composition — owns open state and wires {@link PopoverTrigger},
 * {@link PopoverAnchor}, and {@link PopoverContent} together. Use for small
 * interactive panels (filters, pickers, inline forms); for hover-only previews
 * reach for HoverCard.
 *
 * @component
 * @layer core
 */
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

/**
 * Button that toggles the popover open and closed. Also serves as the
 * positioning anchor unless a {@link PopoverAnchor} is rendered.
 *
 * @component
 * @layer core
 */
function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

/**
 * Optional element the popover content positions against instead of the
 * trigger.
 *
 * @component
 * @layer core
 */
function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

/**
 * Props for {@link PopoverContent}. Extends the Radix Popover content props
 * with the Saasflare theming axes (`surface`, `radius`, `animated`,
 * `iconWeight`).
 */
interface PopoverContentProps
  extends Omit<React.ComponentProps<typeof PopoverPrimitive.Content>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * The floating panel rendered while the popover is open. Portals to the body,
 * enters with a spring scale/fade, and resolves `surface`/`radius`/`animated`
 * against the <SaasflareProvider> context.
 *
 * @component
 * @layer core
 */
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: PopoverContentProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
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

/** Props for {@link PopoverArrow}. Pure pass-through to the Radix Popover arrow. */
interface PopoverArrowProps
  extends React.ComponentProps<typeof PopoverPrimitive.Arrow> {}

/**
 * Triangular arrow pointing from the popover toward its trigger.
 *
 * Renders inside `<PopoverContent>` (consumes Popper context), so it must be a
 * child of the content panel — rendering it elsewhere positions incorrectly.
 * Position/rotation are computed by Radix from the resolved `side`/`align`; no
 * props are required by default. Fill follows the `bg-popover` token via
 * `fill-popover` so it inherits palette + light/dark automatically. The 1px
 * popover border is not auto-continued onto the arrow (Radix limitation, same
 * as shadcn) and the arrow fill stays token-fixed under non-default
 * `surface` overrides — pass a `className` to adjust either if needed.
 *
 * @component
 * @layer core
 * @example
 * <PopoverContent>
 *   <PopoverArrow />
 *   <p>Popover content here.</p>
 * </PopoverContent>
 */
function PopoverArrow({ className, ...props }: PopoverArrowProps) {
  return (
    <PopoverPrimitive.Arrow
      data-slot="popover-arrow"
      width={12}
      height={6}
      className={cn("fill-popover", className)}
      {...props}
    />
  )
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverArrow, type PopoverContentProps, type PopoverArrowProps }
