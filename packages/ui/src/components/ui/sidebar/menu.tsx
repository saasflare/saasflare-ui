// @toreview
"use client"

/**
 * @fileoverview Sidebar menu components — menu items, buttons with tooltip support, sub-menus, actions, badges, and skeletons.
 * Provides the interactive menu primitives for the sidebar. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/sidebar/menu
 * @package ui
 *
 * @example
 * import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@saasflare/ui';
 * <SidebarMenu>
 *   <SidebarMenuItem>
 *     <SidebarMenuButton tooltip="Dashboard" isActive>
 *       Dashboard
 *     </SidebarMenuButton>
 *   </SidebarMenuItem>
 * </SidebarMenu>
 */

// ============================================================================
// SIDEBAR MENU COMPONENTS
// Menu-related components for the sidebar
// ============================================================================

import * as React from "react"
import * as Slot from "@radix-ui/react-slot"
import { cva, VariantProps } from "class-variance-authority"
import { cn } from "../../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../../providers"
import { Skeleton } from "../skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../tooltip"
import { useSidebar } from "./context"

// ============================================================================
// MENU BUTTON VARIANTS
// ============================================================================

export const sidebarMenuButtonVariants = cva(
  "peer/menu-button relative flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding,background-color,color] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-[color-mix(in_oklch,var(--sidebar-primary)_10%,transparent)] data-[active=true]:font-semibold data-[active=true]:text-sidebar-primary data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-1/2 data-[active=true]:before:h-[60%] data-[active=true]:before:w-[3px] data-[active=true]:before:-translate-y-1/2 data-[active=true]:before:rounded-r data-[active=true]:before:bg-sidebar-primary data-[active=true]:before:content-[''] data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// ============================================================================
// MENU COMPONENTS
// ============================================================================

/**
 * Top-level menu list container for the sidebar. Renders a `<ul>` that lays out
 * {@link SidebarMenuItem} children in a vertical stack.
 */
export function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
}

/**
 * Wrapper for a single menu entry. Renders a `<li>` and establishes the
 * `group/menu-item` scope used by actions, badges, and active-state styling.
 */
export function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
}

/** Props for {@link SidebarMenuButton}. */
export interface SidebarMenuButtonProps
  extends Omit<React.ComponentProps<"button">, keyof SaasflareComponentProps>,
    SaasflareComponentProps,
    VariantProps<typeof sidebarMenuButtonVariants> {
  /** Render via Radix `Slot` instead of a `<button>`, merging props onto the child. */
  asChild?: boolean
  /** Marks the button as the active route. Drives the accent indicator + emphasis. */
  isActive?: boolean
  /** Tooltip shown when the sidebar is collapsed. Pass a string or `TooltipContent` props. */
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
}

/**
 * Primary interactive menu button. Supports active state, size/variant styling,
 * and an optional tooltip that surfaces the label when the sidebar is collapsed.
 */
export function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  surface,
  radius,
  animated,
  ...props
}: SidebarMenuButtonProps) {
  const Comp = asChild ? Slot.Root : "button"
  const { isMobile, state } = useSidebar()
  const sf = useSaasflareProps({ surface, radius, animated })

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  )

  if (!tooltip) {
    return button
  }

  const tooltipProps: React.ComponentProps<typeof TooltipContent> =
    typeof tooltip === "string" ? { children: tooltip } : tooltip

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltipProps}
      />
    </Tooltip>
  )
}

/** Props for {@link SidebarMenuAction}. */
export interface SidebarMenuActionProps
  extends Omit<React.ComponentProps<"button">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Render via Radix `Slot` instead of a `<button>`, merging props onto the child. */
  asChild?: boolean
  /** Reveal the action only on item hover/focus (hidden by default on desktop). */
  showOnHover?: boolean
}

/**
 * Trailing action affordance (e.g. a kebab menu) docked to the right edge of a
 * menu item. Optionally reveals only on hover via {@link SidebarMenuActionProps.showOnHover}.
 */
export function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  surface,
  radius,
  animated,
  ...props
}: SidebarMenuActionProps) {
  const Comp = asChild ? Slot.Root : "button"
  const sf = useSaasflareProps({ surface, radius, animated })

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className
      )}
      {...props}
    />
  )
}

/** Props for {@link SidebarMenuBadge}. */
export interface SidebarMenuBadgeProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Small count/status badge anchored to the right edge of a menu item
 * (e.g. unread counts). Non-interactive and hidden in icon-collapsed mode.
 */
export function SidebarMenuBadge({
  className,
  surface,
  radius,
  animated,
  ...props
}: SidebarMenuBadgeProps) {
  const sf = useSaasflareProps({ surface, radius, animated })

  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

/** Props for {@link SidebarMenuSkeleton}. */
export interface SidebarMenuSkeletonProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Render a leading icon-sized skeleton block alongside the text skeleton. */
  showIcon?: boolean
}

/**
 * Loading placeholder for a sidebar menu row. Renders a shimmering text bar
 * (and optional icon block) sized to mimic real menu entries.
 */
export function SidebarMenuSkeleton({
  className,
  showIcon = false,
  surface,
  radius,
  animated,
  ...props
}: SidebarMenuSkeletonProps) {
  const sf = useSaasflareProps({ surface, radius, animated })

  // Deterministic on first render (SSR + hydration match); randomize after mount
  // so each skeleton row varies visually without causing a hydration mismatch.
  const [width, setWidth] = React.useState("70%")
  React.useEffect(() => {
    setWidth(`${Math.floor(Math.random() * 40) + 50}%`)
  }, [])

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

/**
 * Nested sub-menu list container. Renders a `<ul>` with the left guide rail used
 * for grouping {@link SidebarMenuSubItem} children. Hidden in icon-collapsed mode.
 */
export function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

/**
 * Wrapper for a single sub-menu entry. Renders a `<li>` and establishes the
 * `group/menu-sub-item` scope.
 */
export function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  )
}

/** Props for {@link SidebarMenuSubButton}. */
export interface SidebarMenuSubButtonProps
  extends Omit<React.ComponentProps<"a">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Render via Radix `Slot` instead of an `<a>`, merging props onto the child. */
  asChild?: boolean
  /** Type scale for the sub-button label. Defaults to `"md"`. */
  size?: "sm" | "md"
  /** Marks the sub-button as the active route. */
  isActive?: boolean
}

/**
 * Interactive link inside a {@link SidebarMenuSub}. Smaller, indented counterpart
 * to {@link SidebarMenuButton} with active-state styling.
 */
export function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  surface,
  radius,
  animated,
  ...props
}: SidebarMenuSubButtonProps) {
  const Comp = asChild ? Slot.Root : "a"
  const sf = useSaasflareProps({ surface, radius, animated })

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden transition-colors focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-[color-mix(in_oklch,var(--sidebar-primary)_10%,transparent)] data-[active=true]:text-sidebar-primary",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}
