"use client"

// @toreview
/**
 * @fileoverview Empty primitive — placeholder UI for empty states with icon, title,
 * description, and action slots. Renders a dashed-border container centered in its
 * parent. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/empty
 * @layer core
 *
 * @component
 * @example
 * import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent } from '@saasflare/ui';
 * <Empty>
 *   <EmptyHeader>
 *     <EmptyTitle>No items found</EmptyTitle>
 *     <EmptyDescription>Try adjusting your filters.</EmptyDescription>
 *   </EmptyHeader>
 *   <EmptyContent>Create one</EmptyContent>
 * </Empty>
 */
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/**
 * Props for {@link Empty}.
 *
 * Extends {@link SaasflareComponentProps} so `surface`, `radius`, `animated`,
 * and `iconWeight` can be supplied per-instance or inherited from
 * <SaasflareProvider>.
 */
interface EmptyProps extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>, SaasflareComponentProps {}

/**
 * Empty-state placeholder — a dashed-border container centered in its parent.
 * Use when a list, table, or search has nothing to show; compose with
 * {@link EmptyHeader}, {@link EmptyTitle}, {@link EmptyDescription}, and
 * {@link EmptyContent}.
 *
 * @component
 * @layer core
 *
 * @example
 * <Empty>
 *   <EmptyHeader>
 *     <EmptyTitle>No items found</EmptyTitle>
 *     <EmptyDescription>Try adjusting your filters.</EmptyDescription>
 *   </EmptyHeader>
 *   <EmptyContent>Create one</EmptyContent>
 * </Empty>
 */
function Empty({ className, surface, radius, animated, iconWeight, ...props }: EmptyProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <div
      {...props}
      data-slot="empty"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12",
        className
      )}
    />
  )
}

/**
 * Groups the media, title, and description at the top of an {@link Empty}.
 *
 * @component
 * @layer core
 */
function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className
      )}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Icon or illustration slot above the title. `variant="icon"` wraps the icon
 * in a muted rounded tile.
 *
 * @component
 * @layer core
 */
function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

/**
 * Empty-state title text.
 *
 * @component
 * @layer core
 */
function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("text-lg font-medium tracking-tight", className)}
      {...props}
    />
  )
}

/**
 * Empty-state supporting text; nested links are underlined automatically.
 *
 * @component
 * @layer core
 */
function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-description"
      className={cn(
        "text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

/**
 * Action area of an {@link Empty} — holds buttons or links below the header.
 *
 * @component
 * @layer core
 */
function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
  type EmptyProps,
}
