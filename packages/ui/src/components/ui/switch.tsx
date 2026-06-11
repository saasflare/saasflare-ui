// @toreview
"use client"

/**
 * @fileoverview Switch — animated toggle switch with spring physics and size variants.
 * @module packages/ui/components/ui/switch
 * @layer core
 *
 * @component
 * @example
 * import { Switch } from '@saasflare/ui';
 * <Switch checked={enabled} onCheckedChange={setEnabled} />
 * <Switch size="sm" />
 */

import * as React from "react"
import { m } from "motion/react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springBouncy } from "./motion-config"

/**
 * Props for {@link Switch}.
 *
 * Extends the Radix Switch root props with {@link SaasflareComponentProps},
 * so `animated` and the other axes can be supplied per-instance or inherited
 * from <SaasflareProvider>.
 */
interface SwitchProps
  extends Omit<React.ComponentProps<typeof SwitchPrimitive.Root>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Visual size of the toggle. `md` is the standard control; `sm` is a compact variant for dense rows. (`"default"` is a deprecated alias for `"md"`.) */
  size?: "sm" | "md" | "default"
}

/**
 * Toggle switch for boolean settings, with a spring-animated thumb that slides
 * between states. Prefer it over Checkbox when the change takes effect
 * immediately rather than on form submit.
 *
 * @component
 * @layer core
 *
 * @example
 * <Switch checked={enabled} onCheckedChange={setEnabled} />
 */
function Switch({
  className,
  size = "md",
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: SwitchProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const motion = useSaasflareMotion(sf.animated, springBouncy)
  const resolvedSize = size === "default" ? "md" : size

  return (
    <SwitchPrimitive.Root
      {...props}
      data-slot="switch"
      data-size={resolvedSize}
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "peer group/switch inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[size=md]:h-[1.15rem] data-[size=md]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
        "transition-colors duration-200",
        className
      )}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        asChild
      >
        <m.span
          className="pointer-events-none block rounded-full bg-background ring-0 group-data-[size=md]/switch:size-4 group-data-[size=sm]/switch:size-3 dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground"
          layout={!motion.disabled}
          transition={motion.transition}
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch, type SwitchProps }
