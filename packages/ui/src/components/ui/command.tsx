// @toreview
"use client"

/**
 * @fileoverview Command primitive — searchable command palette with keyboard navigation and grouping.
 * Built on cmdk. Includes a dialog variant for modal command menus.
 * Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/command
 * @layer core
 *
 * @component
 * @example
 * import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from '@saasflare/ui';
 * <Command>
 *   <CommandInput placeholder="Search..." />
 *   <CommandList>
 *     <CommandGroup heading="Actions">
 *       <CommandItem>New File</CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </Command>
 */

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { MagnifyingGlassIcon } from "./phosphor"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog"

/**
 * Props for {@link Command}.
 *
 * Extends the cmdk root props with {@link SaasflareComponentProps} so the
 * design-system axes (surface/radius/animated/iconWeight) can be supplied
 * per-instance or inherited from the provider.
 */
interface CommandProps
  extends Omit<React.ComponentProps<typeof CommandPrimitive>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Command palette root — a searchable, keyboard-navigable command menu built on cmdk.
 *
 * Filters {@link CommandItem} children as the user types into {@link CommandInput}.
 * Resolves the design-system axes and emits them as data attributes. For a modal
 * ⌘K-style palette use {@link CommandDialog}.
 *
 * @component
 * @layer core
 */
function Command({
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: CommandProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <CommandPrimitive
      {...props}
      data-slot="command"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
        className
      )}
    />
  )
}

/**
 * Command palette inside a modal {@link Dialog} — the classic ⌘K menu.
 *
 * `title` and `description` feed a visually hidden header for screen readers;
 * the design-system axes are forwarded to both the dialog surface and the
 * inner {@link Command}.
 *
 * @component
 * @layer core
 */
function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: React.ComponentProps<typeof Dialog> &
  SaasflareComponentProps & {
    title?: string
    description?: string
    className?: string
  }) {
  return (
    <Dialog {...props}>
      <DialogContent
        surface={surface}
        radius={radius}
        animated={animated}
        iconWeight={iconWeight}
        className={cn("overflow-hidden p-0", className)}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Command
          surface={surface}
          radius={radius}
          animated={animated}
          iconWeight={iconWeight}
          className="**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Search input that filters the command list as the user types, with a leading
 * magnifying-glass icon that follows the resolved `iconWeight` axis.
 *
 * @component
 * @layer core
 */
function CommandInput({
  className,
  iconWeight,
  ...props
}: Omit<
  React.ComponentProps<typeof CommandPrimitive.Input>,
  keyof Pick<SaasflareComponentProps, "iconWeight">
> &
  Pick<SaasflareComponentProps, "iconWeight">) {
  const sf = useSaasflareProps({ iconWeight })
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <MagnifyingGlassIcon weight={sf.iconWeight} className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

/**
 * Scrollable container for the command groups and items.
 *
 * @component
 * @layer core
 */
function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className
      )}
      {...props}
    />
  )
}

/**
 * Empty state shown when the current search matches no items.
 *
 * @component
 * @layer core
 */
function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  )
}

/**
 * Labeled group of related command items — pass `heading` for the group label.
 *
 * @component
 * @layer core
 */
function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/**
 * Visual divider between command groups.
 *
 * @component
 * @layer core
 */
function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  )
}

/**
 * Selectable command entry — highlighted on keyboard navigation and pointer hover.
 *
 * @component
 * @layer core
 */
function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/**
 * Right-aligned keyboard-shortcut hint inside a {@link CommandItem}.
 *
 * @component
 * @layer core
 */
function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  type CommandProps,
}
