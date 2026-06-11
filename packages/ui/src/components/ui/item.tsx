// @toreview
"use client"

/**
 * @fileoverview Item primitive — versatile list item component with icon, label,
 * description, and action slots. Supports multiple variants (default, link, button)
 * and grouped layouts with separators. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/item
 * @layer core
 *
 * @component
 * @example
 * import { ItemGroup, Item, ItemContent, ItemTitle } from '@saasflare/ui';
 *
 * <ItemGroup>
 *   <Item>
 *     <ItemContent>
 *       <ItemTitle>Settings</ItemTitle>
 *     </ItemContent>
 *   </Item>
 * </ItemGroup>
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import * as Slot from "@radix-ui/react-slot"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { Separator } from "./separator"

/**
 * Vertical container that groups related {@link Item} rows into a list.
 *
 * @component
 * @layer core
 *
 * @example
 * <ItemGroup>
 *   <Item>…</Item>
 *   <ItemSeparator />
 *   <Item>…</Item>
 * </ItemGroup>
 */
function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn("group/item-group flex flex-col", className)}
      {...props}
    />
  )
}

/**
 * Horizontal divider between {@link Item} rows inside an {@link ItemGroup}.
 *
 * @component
 * @layer core
 *
 * @example
 * <ItemSeparator />
 */
function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-0", className)}
      {...props}
    />
  )
}

const itemVariants = cva(
  "group/item flex flex-wrap items-center rounded-md border border-transparent text-sm transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-accent/50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-border",
        muted: "bg-muted/50",
      },
      size: {
        md: "gap-4 p-4",
        sm: "gap-2.5 px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

/** Props for the Saasflare {@link Item} component. */
interface ItemProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    Omit<VariantProps<typeof itemVariants>, "size">,
    SaasflareComponentProps {
  /** Render as child element (Radix Slot pattern). */
  asChild?: boolean
  /** Row density. (`"default"` is a deprecated alias for `"md"`.) */
  size?: VariantProps<typeof itemVariants>["size"] | "default"
}

/**
 * Versatile list row with optional media, content, and action slots.
 *
 * A surfaced, rounded primitive: `surface` and `radius` resolve from the
 * provider via {@link useSaasflareProps} and are emitted as
 * `data-surface`/`data-radius` on the root for CSS theming.
 *
 * @component
 * @layer core
 *
 * @example
 * <Item variant="outline">
 *   <ItemMedia variant="icon"><GearIcon /></ItemMedia>
 *   <ItemContent>
 *     <ItemTitle>Settings</ItemTitle>
 *     <ItemDescription>Manage your account.</ItemDescription>
 *   </ItemContent>
 * </Item>
 */
function Item({
  className,
  variant = "default",
  size = "md",
  asChild = false,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: ItemProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const Comp = asChild ? Slot.Root : "div"
  const resolvedSize = size === "default" ? "md" : size
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={resolvedSize}
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(itemVariants({ variant, size: resolvedSize, className }))}
      {...props}
    />
  )
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "size-8 rounded-sm border bg-muted [&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Leading media slot for an {@link Item} — icon, image, or bare children.
 *
 * @component
 * @layer core
 *
 * @example
 * <ItemMedia variant="icon"><GearIcon /></ItemMedia>
 */
function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

/**
 * Primary content column of an {@link Item} — holds title and description.
 *
 * @component
 * @layer core
 *
 * @example
 * <ItemContent>
 *   <ItemTitle>Settings</ItemTitle>
 * </ItemContent>
 */
function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none",
        className
      )}
      {...props}
    />
  )
}

/**
 * Title line within {@link ItemContent}.
 *
 * @component
 * @layer core
 *
 * @example
 * <ItemTitle>Settings</ItemTitle>
 */
function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "flex w-fit items-center gap-2 text-sm leading-snug font-medium",
        className
      )}
      {...props}
    />
  )
}

/**
 * Secondary description text within {@link ItemContent}.
 *
 * @component
 * @layer core
 *
 * @example
 * <ItemDescription>Manage your account.</ItemDescription>
 */
function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 text-sm leading-normal font-normal text-balance text-muted-foreground",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

/**
 * Trailing actions slot of an {@link Item} — buttons, menus, or controls.
 *
 * @component
 * @layer core
 *
 * @example
 * <ItemActions><Button size="sm">Edit</Button></ItemActions>
 */
function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

/**
 * Full-width header row spanning the top of an {@link Item}.
 *
 * @component
 * @layer core
 *
 * @example
 * <ItemHeader><ItemTitle>Plan</ItemTitle><Badge>Pro</Badge></ItemHeader>
 */
function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

/**
 * Full-width footer row spanning the bottom of an {@link Item}.
 *
 * @component
 * @layer core
 *
 * @example
 * <ItemFooter><ItemDescription>Renews monthly.</ItemDescription></ItemFooter>
 */
function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
  type ItemProps,
}
