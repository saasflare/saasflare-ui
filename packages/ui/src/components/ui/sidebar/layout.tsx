// @toreview
"use client"

/**
 * @fileoverview Sidebar layout components — main sidebar shell, rail, inset area, header, footer, content groups, and input.
 * Provides the structural layout primitives for the sidebar. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/sidebar/layout
 * @package ui
 *
 * @example
 * import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter, SidebarInset } from '@saasflare/ui';
 * <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
 *   <SidebarHeader>Logo</SidebarHeader>
 *   <SidebarContent>
 *     <SidebarGroup>Navigation items</SidebarGroup>
 *   </SidebarContent>
 *   <SidebarFooter>User menu</SidebarFooter>
 * </Sidebar>
 */

// ============================================================================
// SIDEBAR LAYOUT COMPONENTS
// Core layout components for the sidebar
// ============================================================================

import * as React from "react"
import * as Slot from "@radix-ui/react-slot"
import { cn } from "../../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../../providers"
import { Input } from "../input"
import { Separator } from "../separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../sheet"
import { useSidebar, SIDEBAR_WIDTH_MOBILE } from "./context"

// ============================================================================
// MAIN SIDEBAR
// ============================================================================

export interface SidebarProps extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>, SaasflareComponentProps {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
}

/**
 * Root sidebar shell. Renders the collapsible navigation chrome and resolves the
 * design-system axes (`surface`, `radius`, `animated`) onto its root element across
 * the `collapsible="none"`, mobile (Sheet), and desktop branches.
 *
 * @example
 * <Sidebar side="left" variant="floating" collapsible="icon" surface="elevated" radius="lg">
 *   <SidebarHeader>Logo</SidebarHeader>
 *   <SidebarContent>
 *     <SidebarGroup>Navigation items</SidebarGroup>
 *   </SidebarContent>
 *   <SidebarFooter>User menu</SidebarFooter>
 * </Sidebar>
 */
export function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  if (collapsible === "none") {
    return (
      <div
        {...props}
        data-slot="sidebar"
        data-surface={sf.surface}
        data-radius={sf.radius}
        data-animated={String(sf.animated)}
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        )}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          surface={surface}
          radius={radius}
          animated={animated}
          className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SIDEBAR SECTIONS
// ============================================================================

/**
 * Interactive rail along the sidebar edge that toggles the collapsed/expanded state.
 *
 * @example
 * <Sidebar collapsible="icon">…<SidebarRail /></Sidebar>
 */
export function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
}

export interface SidebarInsetProps
  extends Omit<React.ComponentProps<"main">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Main content area that sits beside the sidebar. For the `inset` variant it gains a
 * rounded, elevated surface offset from the sidebar, so it carries the
 * `surface`/`radius`/`animated` axes.
 *
 * @example
 * <SidebarInset surface="elevated" radius="xl">
 *   <PageContent />
 * </SidebarInset>
 */
export function SidebarInset({
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: SidebarInsetProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <main
      data-slot="sidebar-inset"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "bg-background relative flex w-full flex-1 flex-col overflow-auto",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      )}
      {...props}
    />
  )
}

/**
 * Search/filter input styled for placement inside the sidebar header.
 *
 * @example
 * <SidebarHeader><SidebarInput placeholder="Search…" /></SidebarHeader>
 */
export function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("bg-background h-8 w-full shadow-none", className)}
      {...props}
    />
  )
}

/**
 * Top region of the sidebar, typically holding the brand/logo or a search input.
 *
 * @example
 * <SidebarHeader>Logo</SidebarHeader>
 */
export function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

/**
 * Bottom region of the sidebar, typically holding the user menu or secondary actions.
 *
 * @example
 * <SidebarFooter>User menu</SidebarFooter>
 */
export function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

export interface SidebarSeparatorProps
  extends Omit<React.ComponentProps<typeof Separator>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Horizontal divider styled for use between sidebar sections. Carries the
 * `surface`/`radius`/`animated` axes onto its rendered border element.
 *
 * @example
 * <SidebarGroup>…</SidebarGroup>
 * <SidebarSeparator />
 * <SidebarGroup>…</SidebarGroup>
 */
export function SidebarSeparator({
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: SidebarSeparatorProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn("bg-sidebar-border mx-2 w-auto", className)}
      {...props}
    />
  )
}

/**
 * Scrollable middle region of the sidebar that holds the navigation groups.
 *
 * @example
 * <SidebarContent><SidebarGroup>…</SidebarGroup></SidebarContent>
 */
export function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

/**
 * Logical grouping of sidebar items, optionally labelled and with a group action.
 *
 * @example
 * <SidebarGroup>
 *   <SidebarGroupLabel>Projects</SidebarGroupLabel>
 *   <SidebarGroupContent>…</SidebarGroupContent>
 * </SidebarGroup>
 */
export function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
}

/**
 * Heading for a sidebar group. Pass `asChild` to render as a custom element.
 *
 * @example
 * <SidebarGroupLabel>Projects</SidebarGroupLabel>
 */
export function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * Action button anchored to the top-right of a sidebar group. Pass `asChild` to
 * render as a custom element.
 *
 * @example
 * <SidebarGroup>
 *   <SidebarGroupLabel>Projects</SidebarGroupLabel>
 *   <SidebarGroupAction title="Add project"><PlusIcon /></SidebarGroupAction>
 * </SidebarGroup>
 */
export function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

/**
 * Container for the items inside a sidebar group (typically a `SidebarMenu`).
 *
 * @example
 * <SidebarGroupContent><SidebarMenu>…</SidebarMenu></SidebarGroupContent>
 */
export function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  )
}
