// @toreview
"use client"

/**
 * @fileoverview Select — animated dropdown select with spring transitions and grouped options.
 * @module packages/ui/components/ui/select
 * @layer core
 *
 * @component
 * @example
 * import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@saasflare/ui';
 * <Select>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Pick an option" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="one">Option One</SelectItem>
 *     <SelectItem value="two">Option Two</SelectItem>
 *   </SelectContent>
 * </Select>
 */

import * as React from "react"
import { m } from "motion/react"
import { CaretDownIcon, CaretUpIcon, CheckIcon } from "./phosphor"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springBouncy } from "./motion-config"

/**
 * Animated dropdown select built on Radix Select. Manages value and open
 * state; compose with {@link SelectTrigger}, {@link SelectValue},
 * {@link SelectContent}, and {@link SelectItem}. Use for single-choice
 * selection from a list too long for radio buttons.
 *
 * @component
 * @layer core
 */
function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

/**
 * Groups related items inside {@link SelectContent}, typically headed by a
 * {@link SelectLabel}.
 *
 * @component
 * @layer core
 */
function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

/**
 * Displays the selected item's text (or a `placeholder`) inside
 * {@link SelectTrigger}.
 *
 * @component
 * @layer core
 */
function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

/**
 * Button that opens the dropdown — renders the current {@link SelectValue}
 * with a trailing caret icon.
 *
 * @component
 * @layer core
 */
function SelectTrigger({
  className,
  size = "md",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  /** Control height of the trigger. `"md"` (h-9) or `"sm"` (h-8). (`"default"` is a deprecated alias for `"md"`.) */
  size?: "sm" | "md" | "default"
}) {
  const sf = useSaasflareProps()
  const resolvedSize = size === "default" ? "md" : size
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={resolvedSize}
      className={cn(
        "flex w-fit cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow,border-color] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[size=md]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 dark:bg-input/30",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <CaretDownIcon weight={sf.iconWeight} className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

/**
 * Props for {@link SelectContent}. Extends {@link SaasflareComponentProps} so
 * `surface`, `radius`, `animated`, and `iconWeight` can override the
 * <SaasflareProvider> context per instance.
 */
interface SelectContentProps
  extends Omit<React.ComponentProps<typeof SelectPrimitive.Content>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Portalled dropdown panel with a spring entrance animation — hosts the
 * scrollable item viewport plus the scroll-up/down affordances.
 *
 * @component
 * @layer core
 */
function SelectContent({
  className,
  children,
  position = "popper",
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: SelectContentProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const motion = useSaasflareMotion(sf.animated, springBouncy)

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        {...props}
        data-slot="select-content"
        position={position}
        asChild
      >
        <m.div
          data-surface={sf.surface}
          data-radius={sf.radius}
          data-animated={String(sf.animated)}
          initial={motion.disabled ? false : { opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={motion.transition}
          className={cn(
            "relative z-50 max-h-[min(var(--radix-select-content-available-height),24rem)] min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
            position === "popper" &&
              "w-full min-w-[var(--radix-select-trigger-width)]",
            className
          )}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.Viewport
            className={cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)]"
            )}
          >
            {children}
          </SelectPrimitive.Viewport>
          <SelectScrollDownButton />
        </m.div>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

/**
 * Non-interactive heading for a {@link SelectGroup}.
 *
 * @component
 * @layer core
 */
function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-sm font-medium", className)}
      {...props}
    />
  )
}

/**
 * Selectable option inside {@link SelectContent} — shows a check indicator
 * when it is the current value.
 *
 * @component
 * @layer core
 */
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const sf = useSaasflareProps()
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon weight={sf.iconWeight} className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

/**
 * Thin divider between groups of items.
 *
 * @component
 * @layer core
 */
function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

/**
 * Scroll affordance pinned to the top of the viewport when items overflow.
 * Rendered automatically by {@link SelectContent}.
 *
 * @component
 * @layer core
 */
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  const sf = useSaasflareProps()
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <CaretUpIcon weight={sf.iconWeight} className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

/**
 * Scroll affordance pinned to the bottom of the viewport when items overflow.
 * Rendered automatically by {@link SelectContent}.
 *
 * @component
 * @layer core
 */
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  const sf = useSaasflareProps()
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <CaretDownIcon weight={sf.iconWeight} className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectContentProps,
}
