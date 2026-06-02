// @toreview
"use client"

/**
 * @fileoverview Saasflare Progress — animated progress bar.
 * @module packages/ui/components/ui/progress
 * @layer core
 *
 * Self-contained implementation using Radix Progress primitive directly.
 * Width animation respects reduced-motion preference.
 *
 * @example
 * import { Progress } from "@saasflare/ui";
 * <Progress value={65} />
 */

import * as React from "react"
import { m } from "motion/react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, spring } from "./motion-config"

interface ProgressProps
  extends Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Progress bar with smooth spring animation.
 *
 * @component
 * @layer core
 *
 * @param {number} value - Progress value (0-100)
 *
 * @example
 * <Progress value={42} className="w-full" />
 */
function Progress({
  className,
  value,
  surface,
  radius,
  animated,
  ...props
}: ProgressProps) {
  const sf = useSaasflareProps({ surface, radius, animated })
  const motion = useSaasflareMotion(sf.animated, spring)

  return (
    <ProgressPrimitive.Root
      {...props}
      data-slot="progress"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
    >
      <ProgressPrimitive.Indicator data-slot="progress-indicator" asChild>
        <m.div
          className="h-full bg-primary"
          initial={motion.disabled ? false : { width: "0%" }}
          animate={{ width: `${value ?? 0}%` }}
          transition={motion.transition}
        />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
}

export { Progress, type ProgressProps }
