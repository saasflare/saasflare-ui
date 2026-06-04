// @toreview
"use client"

/**
 * @fileoverview Textarea — multi-line text input with spring-animated focus ring and auto-sizing support.
 * @module packages/ui/components/ui/textarea
 * @layer core
 *
 * @component
 * @example
 * import { Textarea } from '@saasflare/ui';
 * <Textarea placeholder="Write your message..." />
 */

import * as React from "react"
import { m } from "motion/react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion } from "./motion-config"

type TextareaBaseProps = Omit<
  React.ComponentProps<"textarea">,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
>

interface TextareaProps
  extends Omit<TextareaBaseProps, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

function Textarea({ className, surface, radius, animated, ...props }: TextareaProps) {
  const sf = useSaasflareProps({ surface, radius, animated })
  const motion = useSaasflareMotion(sf.animated, { type: "spring", stiffness: 300, damping: 20 })

  return (
    <m.textarea
      {...props}
      data-slot="textarea"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      whileFocus={motion.disabled ? undefined : { boxShadow: "0 0 0 3px color-mix(in oklab, var(--ring) 30%, transparent)" }}
      transition={motion.transition}
      className={cn(
        "w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,border-color] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        "field-sizing-content min-h-16",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
    />
  )
}

export { Textarea, type TextareaProps }
