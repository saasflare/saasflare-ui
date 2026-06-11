// @toreview
"use client"

/**
 * @fileoverview HoverCard — premium animated hover-triggered popover card with Motion spring entrance for previewing content on hover.
 * @module packages/ui/components/ui/hover-card
 * @layer core
 *
 * @component
 * @example
 * import { HoverCard, HoverCardTrigger, HoverCardContent } from '@saasflare/ui';
 *
 * <HoverCard>
 *   <HoverCardTrigger>Hover me</HoverCardTrigger>
 *   <HoverCardContent>
 *     <p>Preview content appears here.</p>
 *   </HoverCardContent>
 * </HoverCard>
 */

import * as React from "react"
import { m } from "motion/react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springBouncy } from "./motion-config"

/**
 * Rich preview card shown when an element is hovered, opened without a click.
 * Root of the composition — owns open state and wires {@link HoverCardTrigger}
 * and {@link HoverCardContent} together. Use for non-interactive previews
 * (profiles, link previews); for click-opened interactive panels reach for
 * Popover.
 *
 * @component
 * @layer core
 */
function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
}

/**
 * Element that opens the hover card on hover or keyboard focus. Also serves as
 * the positioning anchor for {@link HoverCardContent}.
 *
 * @component
 * @layer core
 */
function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
}

/**
 * Props for {@link HoverCardContent}. Extends the Radix HoverCard content props
 * with the Saasflare theming axes (`surface`, `radius`, `animated`,
 * `iconWeight`).
 */
interface HoverCardContentProps
  extends Omit<React.ComponentProps<typeof HoverCardPrimitive.Content>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * The floating preview panel rendered while the hover card is open. Portals to
 * the body, enters with a spring scale/fade, and resolves
 * `surface`/`radius`/`animated` against the <SaasflareProvider> context.
 *
 * @component
 * @layer core
 */
function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: HoverCardContentProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
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

/** Props for {@link HoverCardArrow}. Pure pass-through to the Radix HoverCard arrow. */
interface HoverCardArrowProps
  extends React.ComponentProps<typeof HoverCardPrimitive.Arrow> {}

/**
 * Arrow connecting the hover card to its trigger.
 *
 * Renders inside `<HoverCardContent>` (consumes Popper context), so it must be a
 * child of the content panel. Position/rotation are computed by Radix from the
 * resolved `side`/`align`; no props are required by default. Fill follows the
 * `bg-popover` token via `fill-popover` so it inherits palette + light/dark
 * automatically. The 1px card border is not auto-continued onto the arrow (Radix
 * limitation) and the arrow fill stays token-fixed under non-default `surface`
 * overrides — pass a `className` to adjust either if needed.
 *
 * @component
 * @layer core
 * @example
 * <HoverCardContent>
 *   <HoverCardArrow />
 *   <p>Preview content appears here.</p>
 * </HoverCardContent>
 */
function HoverCardArrow({ className, ...props }: HoverCardArrowProps) {
  return (
    <HoverCardPrimitive.Arrow
      data-slot="hover-card-arrow"
      width={12}
      height={6}
      className={cn("fill-popover", className)}
      {...props}
    />
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardArrow, type HoverCardContentProps, type HoverCardArrowProps }
