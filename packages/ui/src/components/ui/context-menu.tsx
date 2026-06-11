// @toreview
"use client"

/**
 * @fileoverview ContextMenu primitive — right-click menu with items, sub-menus, checkboxes, and radio groups.
 * Built on Radix UI ContextMenu. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/context-menu
 * @layer core
 *
 * @component
 * @example
 * import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@saasflare/ui';
 * <ContextMenu>
 *   <ContextMenuTrigger>Right-click here</ContextMenuTrigger>
 *   <ContextMenuContent>
 *     <ContextMenuItem>Copy</ContextMenuItem>
 *     <ContextMenuItem>Paste</ContextMenuItem>
 *   </ContextMenuContent>
 * </ContextMenu>
 */

import * as React from "react"
import { CheckIcon, CaretRightIcon, CircleIcon } from "./phosphor"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/**
 * Right-click menu root. Wraps Radix ContextMenu.Root and manages the open
 * state of a menu anchored at the pointer position. Compose with
 * {@link ContextMenuTrigger} and {@link ContextMenuContent}; supports items,
 * checkbox/radio items, labels, separators, and nested sub-menus.
 *
 * @component
 * @layer core
 *
 * @example
 * <ContextMenu>
 *   <ContextMenuTrigger>Right-click here</ContextMenuTrigger>
 *   <ContextMenuContent>
 *     <ContextMenuItem>Copy</ContextMenuItem>
 *     <ContextMenuItem>Paste</ContextMenuItem>
 *   </ContextMenuContent>
 * </ContextMenu>
 */
function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
}

/**
 * Area that opens the menu on right-click (or long-press on touch).
 *
 * @component
 * @layer core
 */
function ContextMenuTrigger({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  )
}

/**
 * Groups related menu items for semantics and accessibility.
 *
 * @component
 * @layer core
 */
function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  )
}

/**
 * Portals menu content into the document body. {@link ContextMenuContent}
 * already portals itself — reach for this only with custom content trees.
 *
 * @component
 * @layer core
 */
function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  )
}

/**
 * Manages the open state of a nested sub-menu. Compose with
 * {@link ContextMenuSubTrigger} and {@link ContextMenuSubContent}.
 *
 * @component
 * @layer core
 */
function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />
}

/**
 * Container for {@link ContextMenuRadioItem}s sharing a single selected value.
 *
 * @component
 * @layer core
 */
function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  )
}

/**
 * Item that opens a nested sub-menu; renders a trailing caret whose Phosphor
 * weight follows `iconWeight`. Set `inset` to align with items that have
 * indicators.
 *
 * @component
 * @layer core
 */
function ContextMenuSubTrigger({
  className,
  inset,
  iconWeight,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean
} & Pick<SaasflareComponentProps, "iconWeight">) {
  const sf = useSaasflareProps({ iconWeight })
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <CaretRightIcon weight={sf.iconWeight} className="ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  )
}

/**
 * Panel for a nested sub-menu, positioned against its
 * {@link ContextMenuSubTrigger}.
 *
 * @component
 * @layer core
 */
function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      className={cn(
        "z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  )
}

/**
 * Props for {@link ContextMenuContent}. Extends the Radix Content props with
 * `surface`/`radius`/`animated`/`iconWeight` overrides from
 * {@link SaasflareComponentProps}.
 */
interface ContextMenuContentProps
  extends Omit<React.ComponentProps<typeof ContextMenuPrimitive.Content>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Menu panel, portaled and anchored at the pointer position. Honors
 * `surface`/`radius`/`animated` overrides and emits the matching data axes
 * for the design system to style.
 *
 * @component
 * @layer core
 */
function ContextMenuContent({
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: ContextMenuContentProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        {...props}
        data-slot="context-menu-content"
        data-surface={sf.surface}
        data-radius={sf.radius}
        data-animated={String(sf.animated)}
        className={cn(
          "z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className
        )}
      />
    </ContextMenuPrimitive.Portal>
  )
}

/**
 * Selectable menu item. Use `variant="destructive"` for dangerous actions
 * and `inset` to align with items that have indicators.
 *
 * @component
 * @layer core
 */
function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!",
        className
      )}
      {...props}
    />
  )
}

/**
 * Menu item with a togglable checked state, shown via a leading check
 * indicator whose Phosphor weight follows `iconWeight`.
 *
 * @component
 * @layer core
 */
function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  iconWeight,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem> &
  Pick<SaasflareComponentProps, "iconWeight">) {
  const sf = useSaasflareProps({ iconWeight })
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon weight={sf.iconWeight} className="size-4" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

/**
 * Single-selection item within a {@link ContextMenuRadioGroup}; shows a
 * leading dot indicator when selected.
 *
 * @component
 * @layer core
 */
function ContextMenuRadioItem({
  className,
  children,
  iconWeight,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem> &
  Pick<SaasflareComponentProps, "iconWeight">) {
  const sf = useSaasflareProps({ iconWeight })
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CircleIcon weight={sf.iconWeight} className="size-2 fill-current" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
}

/**
 * Non-interactive heading for a group of menu items. Set `inset` to align
 * with items that have indicators.
 *
 * @component
 * @layer core
 */
function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium text-foreground data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

/**
 * Thin divider between menu items or groups.
 *
 * @component
 * @layer core
 */
function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

/**
 * Right-aligned keyboard shortcut hint inside a menu item. Purely visual —
 * it does not register the key binding.
 *
 * @component
 * @layer core
 */
function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  type ContextMenuContentProps,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
