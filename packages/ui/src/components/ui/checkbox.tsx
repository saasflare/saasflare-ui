// @toreview
"use client"

/**
 * @fileoverview Checkbox — toggle input with Motion spring check-mark animation.
 * @module packages/ui/components/ui/checkbox
 * @layer core
 *
 * Self-contained implementation built on Radix Checkbox primitive. The check
 * indicator uses a bouncy spring scale animation via Motion that plays on mount
 * when the checkbox becomes checked.
 *
 * @component
 * @example
 * import { Checkbox } from "@saasflare/ui";
 *
 * <Checkbox id="terms" />
 * <label htmlFor="terms">Accept terms and conditions</label>
 */

import * as React from "react"
import { m } from "motion/react"
import { CheckIcon } from "./phosphor"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springBouncy } from "./motion-config"

/**
 * Props for {@link Checkbox}.
 *
 * Extends the Radix Checkbox root props with {@link SaasflareComponentProps},
 * so `surface`, `radius`, `animated`, and `iconWeight` can be supplied
 * per-instance or inherited from <SaasflareProvider>.
 */
interface CheckboxProps
  extends Omit<React.ComponentProps<typeof CheckboxPrimitive.Root>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Checkbox input with a bouncy spring check-mark animation. Built on the
 * Radix Checkbox primitive; supports controlled and uncontrolled checked
 * state. Pair with a `<label htmlFor>` for an accessible name.
 *
 * @component
 * @layer core
 *
 * @example
 * <Checkbox id="terms" />
 * <label htmlFor="terms">Accept terms and conditions</label>
 */
function Checkbox({
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: CheckboxProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
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
          <CheckIcon weight={sf.iconWeight} className="size-3.5" />
        </m.span>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox, type CheckboxProps }
