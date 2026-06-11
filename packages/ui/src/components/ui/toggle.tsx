// @toreview
"use client"

/**
 * @fileoverview Toggle — two-state button with pressed/unpressed styling, size variants, and outline mode.
 * @module packages/ui/components/ui/toggle
 * @layer core
 *
 * @component
 * @example
 * import { Toggle } from '@saasflare/ui';
 * <Toggle variant="outline" aria-label="Toggle bold">
 *   <BoldIcon className="size-4" />
 * </Toggle>
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/**
 * Toggle variant definitions (cva): `variant` (default | outline) × `size`
 * (sm | md | lg). Consumed by {@link Toggle} and shared with ToggleGroupItem
 * so grouped items match standalone toggles.
 */
const toggleVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-150 outline-none hover:bg-muted hover:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground active:scale-95 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        md: "h-9 min-w-9 px-2",
        sm: "h-8 min-w-8 px-1.5",
        lg: "h-10 min-w-10 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

/**
 * Props for {@link Toggle}.
 *
 * Extends the Radix Toggle root props with {@link SaasflareComponentProps},
 * so `surface`, `radius`, `animated`, and `iconWeight` can be supplied
 * per-instance or inherited from <SaasflareProvider>.
 */
interface ToggleProps
  extends Omit<React.ComponentProps<typeof TogglePrimitive.Root>, keyof SaasflareComponentProps>,
    Omit<VariantProps<typeof toggleVariants>, "size">,
    SaasflareComponentProps {
  /** Visual size. (`"default"` is a deprecated alias for `"md"`.) */
  size?: VariantProps<typeof toggleVariants>["size"] | "default"
}

/**
 * Two-state button that switches between pressed and unpressed — e.g. toolbar
 * formatting controls like bold or italic. Icon-only usage requires an
 * `aria-label` for an accessible name.
 *
 * @component
 * @layer core
 *
 * @example
 * <Toggle variant="outline" aria-label="Toggle bold">
 *   <BoldIcon className="size-4" />
 * </Toggle>
 */
function Toggle({
  className,
  variant,
  size,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: ToggleProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const resolvedSize = size === "default" ? "md" : size

  return (
    <TogglePrimitive.Root
      {...props}
      data-slot="toggle"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(toggleVariants({ variant, size: resolvedSize, className }))}
    />
  )
}

export { Toggle, toggleVariants, type ToggleProps }
