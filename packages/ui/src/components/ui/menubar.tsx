// @toreview
"use client"

/**
 * @fileoverview Menubar primitive — horizontal menu bar with dropdown menus, checkbox items, and keyboard navigation.
 * Built on Radix UI Menubar. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/menubar
 * @layer core
 *
 * @component
 * @example
 * import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from '@saasflare/ui';
 * <Menubar>
 *   <MenubarMenu>
 *     <MenubarTrigger>File</MenubarTrigger>
 *     <MenubarContent>
 *       <MenubarItem>New</MenubarItem>
 *       <MenubarItem>Open</MenubarItem>
 *     </MenubarContent>
 *   </MenubarMenu>
 * </Menubar>
 */

import * as React from "react"
import { CheckIcon, CaretRightIcon, CircleIcon } from "./phosphor"
import * as MenubarPrimitive from "@radix-ui/react-menubar"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/**
 * Props for {@link Menubar}.
 *
 * Extends the Radix Menubar root props with {@link SaasflareComponentProps},
 * so `surface`, `radius`, `animated`, and `iconWeight` can be supplied
 * per-instance or inherited from <SaasflareProvider>.
 */
interface MenubarProps
  extends Omit<React.ComponentProps<typeof MenubarPrimitive.Root>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Root horizontal menu bar. Owns the Saasflare surface/radius/animated context for
 * its menus and emits the corresponding data attributes.
 */
function Menubar({
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: MenubarProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <MenubarPrimitive.Root
      {...props}
      data-slot="menubar"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs",
        className
      )}
    />
  )
}

/** A single menu within the menubar, pairing a trigger with its content. */
function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />
}

/** Groups related menu items together for semantic structure. */
function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />
}

/** Portals menu content into the document body, outside the DOM flow. */
function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />
}

/** Groups radio items so only one can be checked at a time. */
function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  )
}

/** Clickable label that opens its associated menu. */
function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

/**
 * Props for {@link MenubarContent}.
 *
 * Extends the Radix Menubar content props (`align`, `alignOffset`,
 * `sideOffset`, …) with {@link SaasflareComponentProps}.
 */
interface MenubarContentProps
  extends Omit<React.ComponentProps<typeof MenubarPrimitive.Content>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Floating panel that holds a menu's items. Inherits surface/radius/animated and
 * emits the matching data attributes for CSS-driven motion.
 */
function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: MenubarContentProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        {...props}
        data-slot="menubar-content"
        data-surface={sf.surface}
        data-radius={sf.radius}
        data-animated={String(sf.animated)}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className
        )}
      />
    </MenubarPortal>
  )
}

/** Selectable menu item. Supports an inset variant and a destructive variant. */
function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
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

/** Menu item with a checkmark indicator reflecting its checked state. */
function MenubarCheckboxItem({
  className,
  children,
  checked,
  iconWeight,
  ...props
}: Omit<React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>, keyof SaasflareComponentProps> &
  Pick<SaasflareComponentProps, "iconWeight">) {
  const sf = useSaasflareProps({ iconWeight })
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon weight={sf.iconWeight} className="size-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

/** Menu item with a dot indicator for single-selection radio groups. */
function MenubarRadioItem({
  className,
  children,
  iconWeight,
  ...props
}: Omit<React.ComponentProps<typeof MenubarPrimitive.RadioItem>, keyof SaasflareComponentProps> &
  Pick<SaasflareComponentProps, "iconWeight">) {
  const sf = useSaasflareProps({ iconWeight })
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon weight={sf.iconWeight} className="size-2 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
}

/** Non-interactive heading used to caption a group of menu items. */
function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

/** Thin horizontal divider between groups of menu items. */
function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

/** Right-aligned hint showing the keyboard shortcut for a menu item. */
function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/** Wrapper for a nested submenu, pairing a sub-trigger with sub-content. */
function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

/** Menu item that opens a nested submenu, with a trailing caret indicator. */
function MenubarSubTrigger({
  className,
  inset,
  children,
  iconWeight,
  ...props
}: Omit<React.ComponentProps<typeof MenubarPrimitive.SubTrigger>, keyof SaasflareComponentProps> & {
  inset?: boolean
} & Pick<SaasflareComponentProps, "iconWeight">) {
  const sf = useSaasflareProps({ iconWeight })
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
      <CaretRightIcon weight={sf.iconWeight} className="ml-auto h-4 w-4" />
    </MenubarPrimitive.SubTrigger>
  )
}

/** Floating panel for a nested submenu's items. */
function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  )
}

export {
  Menubar,
  type MenubarProps,
  type MenubarContentProps,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
