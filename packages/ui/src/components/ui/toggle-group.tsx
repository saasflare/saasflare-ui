// @toreview
"use client"

/**
 * @fileoverview ToggleGroup — grouped toggle buttons with shared state, variant styling, and configurable spacing.
 * @module packages/ui/components/ui/toggle-group
 * @layer core
 *
 * @component
 * @example
 * import { ToggleGroup, ToggleGroupItem } from '@saasflare/ui';
 * <ToggleGroup type="single" defaultValue="center">
 *   <ToggleGroupItem value="left">Left</ToggleGroupItem>
 *   <ToggleGroupItem value="center">Center</ToggleGroupItem>
 *   <ToggleGroupItem value="right">Right</ToggleGroupItem>
 * </ToggleGroup>
 */

import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { toggleVariants } from "./toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number
  }
>({
  size: "md",
  variant: "default",
  spacing: 0,
})

/**
 * Props for {@link ToggleGroup}.
 *
 * Combines the Radix ToggleGroup root props (`type`, `value`, …) with the
 * shared toggle variant axes and {@link SaasflareComponentProps}. `variant`
 * and `size` propagate to every {@link ToggleGroupItem} via context.
 */
type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  Omit<VariantProps<typeof toggleVariants>, "size"> &
  SaasflareComponentProps & {
    /** Visual size of the items. (`"default"` is a deprecated alias for `"md"`.) */
    size?: VariantProps<typeof toggleVariants>["size"] | "default"
    /** Gap (in spacing units) between items. `0` (default) renders a joined, segmented group; a positive value detaches the items into spaced pills. */
    spacing?: number
  }

/**
 * Set of two-state buttons with shared single or multiple selection. Renders
 * as a joined, segmented control by default; set `spacing` to detach the items
 * into spaced pills. `variant` and `size` apply to all items via context.
 *
 * @component
 * @layer core
 *
 * @example
 * <ToggleGroup type="single" defaultValue="center">
 *   <ToggleGroupItem value="left">Left</ToggleGroupItem>
 *   <ToggleGroupItem value="center">Center</ToggleGroupItem>
 *   <ToggleGroupItem value="right">Right</ToggleGroupItem>
 * </ToggleGroup>
 */
function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  children,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: ToggleGroupProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const resolvedSize = size === "default" ? "md" : size

  return (
    <ToggleGroupPrimitive.Root
      {...props}
      data-slot="toggle-group"
      data-variant={variant}
      data-size={resolvedSize}
      data-spacing={spacing}
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        "group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=0]:data-[variant=outline]:shadow-xs",
        className
      )}
    >
      <ToggleGroupContext.Provider value={{ variant, size: resolvedSize, spacing }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

/**
 * A single toggle within a {@link ToggleGroup}. Inherits `variant`, `size`,
 * and `spacing` from the group context; group values win over item props.
 *
 * @component
 * @layer core
 */
function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10",
        "data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first:border-l",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem, type ToggleGroupProps }
