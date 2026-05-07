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
import { springBouncy } from "./motion-config"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 cursor-pointer rounded-lg border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current"
        asChild
      >
        <m.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={springBouncy}
        >
          <CheckIcon className="size-3.5" />
        </m.span>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
