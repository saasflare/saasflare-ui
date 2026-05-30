// @toreview
"use client"

/**
 * @fileoverview Switch — animated toggle switch with spring physics and size variants.
 * @module packages/core/components/ui/switch
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

interface SwitchProps
  extends Omit<React.ComponentProps<typeof SwitchPrimitive.Root>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  size?: "sm" | "default"
}

function Switch({
  className,
  size = "default",
  surface,
  radius,
  animated,
  ...props
}: SwitchProps) {
  const sf = useSaasflareProps({ surface, radius, animated })
  const motion = useSaasflareMotion(sf.animated, springBouncy)

  return (
    <SwitchPrimitive.Root
      {...props}
      data-slot="switch"
      data-size={size}
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "peer group/switch inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[1.15rem] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
        "transition-colors duration-200",
        className
      )}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        asChild
      >
        <m.span
          className="pointer-events-none block rounded-full bg-background ring-0 group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground"
          layout={motion.disabled ? false : true}
          transition={motion.transition}
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch, type SwitchProps }
