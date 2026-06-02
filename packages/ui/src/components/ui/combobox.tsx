// @toreview
"use client"

/**
 * @fileoverview Combobox primitive — searchable dropdown built on Radix Popover + cmdk.
 * Thin compositional wrapper: `Combobox` is `Popover.Root`, `ComboboxContent` mounts a
 * `cmdk` Command palette inside a `Popover.Content`. Consumers compose the trigger
 * (typically a Button) and items themselves; this gives a shadcn-style Combobox
 * without a separate runtime dependency on a higher-level combobox primitive.
 *
 * For multi-select-with-chips, compose `Combobox` with the `Badge` component and
 * a controlled value list — the chip pattern is intentionally not built in.
 *
 * @module packages/ui/components/ui/combobox
 * @layer core
 *
 * @component
 * @example
 * import {
 *   Combobox, ComboboxTrigger, ComboboxContent,
 *   ComboboxInput, ComboboxList, ComboboxItem,
 * } from "@saasflare/ui"
 *
 * <Combobox>
 *   <ComboboxTrigger asChild>
 *     <Button variant="outline">{label ?? "Select…"}</Button>
 *   </ComboboxTrigger>
 *   <ComboboxContent>
 *     <ComboboxInput placeholder="Search…" />
 *     <ComboboxList>
 *       <ComboboxItem value="react">React</ComboboxItem>
 *       <ComboboxItem value="vue">Vue</ComboboxItem>
 *     </ComboboxList>
 *   </ComboboxContent>
 * </Combobox>
 */

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Command as CommandPrimitive } from "cmdk"
import { CheckIcon, MagnifyingGlassIcon } from "./phosphor"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

const Combobox = PopoverPrimitive.Root

const ComboboxTrigger = PopoverPrimitive.Trigger

/** Props for {@link ComboboxContent}. */
interface ComboboxContentProps
  extends Omit<React.ComponentProps<typeof PopoverPrimitive.Content>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Popover surface that mounts the `cmdk` command palette. This is the themeable
 * chrome of the combobox — honors `surface`/`radius`/`animated` overrides and
 * emits the matching data axes on its root for the design system to style.
 */
function ComboboxContent({
  className,
  align = "start",
  sideOffset = 6,
  surface,
  radius,
  animated,
  children,
  ...props
}: ComboboxContentProps) {
  const sf = useSaasflareProps({ surface, radius, animated })
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="combobox-content"
        data-surface={sf.surface}
        data-radius={sf.radius}
        data-animated={String(sf.animated)}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-[var(--radix-popover-trigger-width)] min-w-[12rem] origin-[var(--radix-popover-content-transform-origin)] overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className
        )}
        {...props}
      >
        <CommandPrimitive
          data-slot="combobox"
          className="flex w-full flex-col"
        >
          {children}
        </CommandPrimitive>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

/** Props for {@link ComboboxInput}. */
interface ComboboxInputProps
  extends Omit<React.ComponentProps<typeof CommandPrimitive.Input>, "iconWeight">,
    Pick<SaasflareComponentProps, "iconWeight"> {}

/** Search field for the combobox, with a leading magnifier whose Phosphor weight follows `iconWeight`. */
function ComboboxInput({
  className,
  iconWeight,
  ...props
}: ComboboxInputProps) {
  const sf = useSaasflareProps({ iconWeight })
  return (
    <div
      data-slot="combobox-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <MagnifyingGlassIcon weight={sf.iconWeight} className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        data-slot="combobox-input"
        className={cn(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

/** Scrollable list region that holds {@link ComboboxItem}s, groups, and the empty state. */
function ComboboxList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "max-h-[min(24rem,var(--radix-popover-content-available-height))] scroll-py-1 overflow-x-hidden overflow-y-auto p-1",
        className
      )}
      {...props}
    />
  )
}

/** Selectable option row. Pass `selected` to render a trailing check indicator. */
function ComboboxItem({
  className,
  children,
  selected,
  iconWeight,
  ...props
}: Omit<React.ComponentProps<typeof CommandPrimitive.Item>, "iconWeight"> & {
  /** Show a leading check indicator. Lets consumers render selection state without a separate Indicator slot. */
  selected?: boolean
  /** Icon weight override for the selection check indicator. Omit to inherit from provider. */
  iconWeight?: SaasflareComponentProps["iconWeight"]
}) {
  const sf = useSaasflareProps({ iconWeight })
  return (
    <CommandPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      {selected ? (
        <CheckIcon
          weight={sf.iconWeight}
          data-slot="combobox-item-indicator"
          className="absolute right-2 size-4"
        />
      ) : null}
    </CommandPrimitive.Item>
  )
}

/** Labeled section of items. Render a `[cmdk-group-heading]` child for the group title. */
function ComboboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="combobox-group"
      className={cn(
        "overflow-hidden text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/** Fallback shown when the current query matches no items. */
function ComboboxEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="combobox-empty"
      className={cn("py-6 text-center text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

/** Thin divider between groups or items inside the list. */
function ComboboxSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

export {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxEmpty,
  ComboboxSeparator,
  type ComboboxContentProps,
  type ComboboxInputProps,
}
