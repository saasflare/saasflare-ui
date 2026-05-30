// @toreview
"use client"

/**
 * @fileoverview Input — premium text input with Framer Motion animated focus ring and spring transition for polished form interactions.
 * @module packages/core/components/ui/input
 * @layer core
 *
 * @component
 * @example
 * import { Input } from '@saasflare/ui';
 *
 * <Input type="email" placeholder="you@example.com" />
 */

import * as React from "react"
import { m } from "motion/react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion } from "./motion-config"

type InputBaseProps = Omit<
  React.ComponentProps<"input">,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
>

interface InputProps extends Omit<InputBaseProps, keyof SaasflareComponentProps>, SaasflareComponentProps {}

function Input({ className, type, surface, radius, animated, ...props }: InputProps) {
  const sf = useSaasflareProps({ surface, radius, animated })
  const motion = useSaasflareMotion(sf.animated, { type: "spring", stiffness: 300, damping: 20 })

  return (
    <m.input
      {...props}
      type={type}
      data-slot="input"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      whileFocus={motion.disabled ? undefined : { boxShadow: "0 0 0 3px hsl(var(--ring) / 0.3)" }}
      transition={motion.transition}
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,border-color] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        "focus-visible:border-ring",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
    />
  )
}

export { Input, type InputProps }
