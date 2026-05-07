// @toreview
"use client"

/**
 * @fileoverview Saasflare Progress — animated progress bar.
 * @module packages/core/components/ui/progress
 * @layer core
 *
 * Self-contained implementation using Radix Progress primitive directly.
 * Width animation respects reduced-motion preference.
 *
 * @example
 * import { Progress } from "@saasflare/core";
 * <Progress value={65} />
 */

import * as React from "react"
import { m } from "motion/react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "../../lib"
import { spring, noMotion, useReducedMotion } from "./motion-config"

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
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const reduced = useReducedMotion()

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator data-slot="progress-indicator" asChild>
        <m.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${value ?? 0}%` }}
          transition={reduced ? noMotion : spring}
        />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
