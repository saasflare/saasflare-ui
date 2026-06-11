// @toreview
"use client"

/**
 * @fileoverview NavigationMenu primitive — site navigation with animated dropdowns, viewport support, and active indicators.
 * Built on Radix UI NavigationMenu. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/navigation-menu
 * @layer core
 *
 * @component
 * @example
 * import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from '@saasflare/ui';
 * <NavigationMenu>
 *   <NavigationMenuList>
 *     <NavigationMenuItem>
 *       <NavigationMenuTrigger>Products</NavigationMenuTrigger>
 *       <NavigationMenuContent>
 *         <NavigationMenuLink href="/docs">Documentation</NavigationMenuLink>
 *       </NavigationMenuContent>
 *     </NavigationMenuItem>
 *   </NavigationMenuList>
 * </NavigationMenu>
 */
import * as React from "react"
import { cva } from "class-variance-authority"
import { CaretDownIcon } from "./phosphor"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/**
 * Props for {@link NavigationMenu}.
 *
 * `viewport` toggles the shared {@link NavigationMenuViewport} that hosts all
 * dropdown content in one animated panel; set it to `false` to render each
 * item's content as a self-contained popover below its trigger instead.
 */
interface NavigationMenuProps
  extends Omit<React.ComponentProps<typeof NavigationMenuPrimitive.Root>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /**
   * Render the shared viewport panel for dropdown content.
   *
   * @default true
   */
  viewport?: boolean
}

/**
 * Site navigation root with animated dropdown menus, built on Radix NavigationMenu.
 *
 * Hosts a {@link NavigationMenuList} of items and, by default, a shared
 * {@link NavigationMenuViewport} that all dropdown content animates into.
 * Resolves the design-system axes and emits them as data attributes. Use for
 * horizontal header navigation.
 *
 * @component
 * @layer core
 */
function NavigationMenu({
  className,
  children,
  viewport = true,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: NavigationMenuProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <NavigationMenuPrimitive.Root
      {...props}
      data-slot="navigation-menu"
      data-viewport={String(viewport)}
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

/**
 * Horizontal list that lays out the top-level {@link NavigationMenuItem} entries.
 *
 * @component
 * @layer core
 */
function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  )
}

/**
 * A single menu entry — wraps a trigger/content pair or a standalone link.
 *
 * @component
 * @layer core
 */
function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

/**
 * cva builder for the trigger button styles. Applied internally by
 * {@link NavigationMenuTrigger}; call it on a plain {@link NavigationMenuLink}
 * to make a top-level link match the trigger appearance.
 */
const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-[color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent"
)

interface NavigationMenuTriggerProps
  extends React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>,
    Pick<SaasflareComponentProps, "iconWeight"> {}

/**
 * Button that opens an item's {@link NavigationMenuContent}. Renders a caret
 * that rotates while open and follows the resolved `iconWeight` axis.
 *
 * @component
 * @layer core
 */
function NavigationMenuTrigger({
  className,
  children,
  iconWeight,
  ...props
}: NavigationMenuTriggerProps) {
  const sf = useSaasflareProps({ iconWeight })
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <CaretDownIcon weight={sf.iconWeight}
        className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

interface NavigationMenuContentProps
  extends Omit<React.ComponentProps<typeof NavigationMenuPrimitive.Content>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Dropdown panel for a menu item. Renders into the shared
 * {@link NavigationMenuViewport} when the root has `viewport` enabled,
 * otherwise as a self-contained popover below its trigger.
 *
 * @component
 * @layer core
 */
function NavigationMenuContent({
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: NavigationMenuContentProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "top-0 left-0 w-full p-2 pr-2.5 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  )
}

interface NavigationMenuViewportProps
  extends Omit<React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Shared panel that hosts the active item's content and animates between sizes.
 * Rendered automatically by {@link NavigationMenu} unless `viewport` is `false`.
 *
 * @component
 * @layer core
 */
function NavigationMenuViewport({
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: NavigationMenuViewportProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  return (
    <div className="absolute top-full left-0 isolate z-50 flex justify-center">
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        data-surface={sf.surface}
        data-radius={sf.radius}
        data-animated={String(sf.animated)}
        className={cn(
          "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
          className
        )}
        {...props}
      />
    </div>
  )
}

interface NavigationMenuLinkProps
  extends Omit<React.ComponentProps<typeof NavigationMenuPrimitive.Link>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Navigational link inside the menu — use `asChild` to compose with a framework
 * router link. Works standalone in an item or inside dropdown content.
 *
 * @component
 * @layer core
 */
function NavigationMenuLink({
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: NavigationMenuLinkProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground data-[active=true]:hover:bg-accent data-[active=true]:focus:bg-accent [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

interface NavigationMenuIndicatorProps
  extends Omit<React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Animated arrow that tracks the active trigger and points at the open content.
 *
 * @component
 * @layer core
 */
function NavigationMenuIndicator({
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: NavigationMenuIndicatorProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  type NavigationMenuProps,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
