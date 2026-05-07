// @toreview
"use client"

/**
 * @fileoverview Checkbox — toggle input with Framer Motion spring check-mark animation.
 * @module packages/core/components/ui/checkbox
 * @layer core
 *
 * Self-contained implementation built on Radix Checkbox primitive. The check
 * indicator uses a bouncy spring scale animation via Framer Motion with
 * AnimatePresence for smooth mount/unmount transitions.
 *
 * @component
 * @example
 * import { Checkbox } from "@saasflare/core";
 *
 * <Checkbox id="terms" />
 * <label htmlFor="terms">Accept terms and conditions</label>
 */

import * as React from "react"
import { m, AnimatePresence } from "motion/react"
import { CheckIcon } from "lucide-react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springBouncy } from "./motion-config"

interface CheckboxProps
  extends Omit<React.ComponentProps<typeof CheckboxPrimitive.Root>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

function Checkbox({
  className,
  surface,
  radius,
  animated,
  ...props
}: CheckboxProps) {
  const sf = useSaasflareProps({ surface, radius, animated })
  const motion = useSaasflareMotion(sf.animated, springBouncy)

  return (
    <CheckboxPrimitive.Root
      {...props}
      data-slot="checkbox"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "peer size-4 shrink-0 cursor-pointer rounded-lg border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary",
        className
      )}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current"
        asChild
      >
        <m.span
          initial={motion.disabled ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={motion.disabled ? undefined : { scale: 0, opacity: 0 }}
          transition={motion.transition}
        >
          <CheckIcon className="size-3.5" />
        </m.span>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox, type CheckboxProps }
