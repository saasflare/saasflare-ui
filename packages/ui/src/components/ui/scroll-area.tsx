// @toreview
"use client"

/**
 * @fileoverview ScrollArea primitive — custom scrollable container with styled scrollbar thumb.
 * Built on Radix UI ScrollArea. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/scroll-area
 * @layer core
 *
 * @component
 * @example
 * import { ScrollArea } from '@saasflare/ui';
 * <ScrollArea className="h-72">
 *   <div>Scrollable content here</div>
 * </ScrollArea>
 */

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/**
 * Props for {@link ScrollArea}.
 *
 * Extends the Radix ScrollArea root props with {@link SaasflareComponentProps}.
 */
interface ScrollAreaProps
  extends Omit<React.ComponentProps<typeof ScrollAreaPrimitive.Root>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Scrollable container that replaces native scrollbars with a styled,
 * cross-browser thumb, built on Radix UI ScrollArea. Constrain it with a
 * height or width class and place overflowing content inside.
 *
 * @component
 * @layer core
 */
function ScrollArea({
  className,
  children,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: ScrollAreaProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <ScrollAreaPrimitive.Root
      {...props}
      data-slot="scroll-area"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn("relative", className)}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

/**
 * Styled scrollbar for {@link ScrollArea}. A vertical instance is rendered
 * automatically; add one with `orientation="horizontal"` for horizontal
 * scrolling.
 *
 * @component
 * @layer core
 */
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar, type ScrollAreaProps }
