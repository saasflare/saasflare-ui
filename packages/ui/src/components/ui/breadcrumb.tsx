// @toreview
"use client"

/**
 * @fileoverview Breadcrumb primitive — navigation trail showing the current page hierarchy.
 * Pure Tailwind component with Radix UI Slot for flexible link rendering.
 * Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/breadcrumb
 * @layer core
 *
 * @component
 * @example
 * import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from '@saasflare/ui';
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
 *     <BreadcrumbItem><BreadcrumbPage>Current</BreadcrumbPage></BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 */
import * as React from "react"
import { CaretRightIcon, DotsThreeIcon } from "./phosphor"
import * as Slot from "@radix-ui/react-slot"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/**
 * Props for {@link Breadcrumb}. Extends the native `<nav>` props with the
 * Saasflare axes (`surface`, `radius`, `animated`, `iconWeight`) inherited from
 * {@link SaasflareComponentProps}. Breadcrumb is a text-navigation subset, so the
 * axes are emitted on the root for consistency rather than driving a surface.
 */
interface BreadcrumbProps extends Omit<React.ComponentProps<"nav">, keyof SaasflareComponentProps>, SaasflareComponentProps {}

/**
 * Breadcrumb navigation root — labelled `<nav>` wrapping the trail. Resolves the
 * Saasflare axes and emits `data-surface`/`data-radius`/`data-animated`.
 */
function Breadcrumb({ surface, radius, animated, iconWeight, ...props }: BreadcrumbProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <nav
      {...props}
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
    />
  )
}

/** Ordered list (`<ol>`) holding the breadcrumb items and separators. */
function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

/** Single breadcrumb entry (`<li>`) — wraps a {@link BreadcrumbLink} or {@link BreadcrumbPage}. */
function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

/**
 * Interactive breadcrumb link (`<a>`). Pass `asChild` to render through a custom
 * element (e.g. a framework `<Link>`) via Radix Slot while keeping the styling.
 *
 * @param asChild - When `true`, merges props onto the single child element instead
 *   of rendering an `<a>`.
 */
function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
}

/** Current-page node (`<span>`) — the non-interactive, `aria-current="page"` trail end. */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  )
}

/**
 * Visual divider (`<li>`) between items. Defaults to a Phosphor caret that adopts
 * the provider's `iconWeight`; override via `children` for a custom glyph.
 */
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  const sf = useSaasflareProps()
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <CaretRightIcon weight={sf.iconWeight} />}
    </li>
  )
}

/** Collapsed-trail indicator (`<span>`) — a Phosphor ellipsis glyph plus screen-reader "More". */
function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const sf = useSaasflareProps()
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <DotsThreeIcon weight={sf.iconWeight} className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  type BreadcrumbProps,
}
