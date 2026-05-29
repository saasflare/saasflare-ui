// @toreview
"use client"

/**
 * @fileoverview Toggle — two-state button with pressed/unpressed styling, size variants, and outline mode.
 * @module packages/core/components/ui/toggle
 * @layer core
 *
 * @component
 * @example
 * import { Toggle } from '@saasflare/ui';
 * <Toggle variant="outline" aria-label="Toggle bold">
 *   <BoldIcon className="size-4" />
 * </Toggle>
 */
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

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
        default: "h-9 min-w-9 px-2",
        sm: "h-8 min-w-8 px-1.5",
        lg: "h-10 min-w-10 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ToggleProps
  extends Omit<React.ComponentProps<typeof TogglePrimitive.Root>, keyof SaasflareComponentProps>,
    VariantProps<typeof toggleVariants>,
    SaasflareComponentProps {}

function Toggle({
  className,
  variant,
  size,
  surface,
  radius,
  animated,
  ...props
}: ToggleProps) {
  const sf = useSaasflareProps({ surface, radius, animated })

  return (
    <TogglePrimitive.Root
      {...props}
      data-slot="toggle"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(toggleVariants({ variant, size, className }))}
    />
  )
}

export { Toggle, toggleVariants, type ToggleProps }
