// @toreview
"use client"

/**
 * @fileoverview Textarea — multi-line text input with spring-animated focus ring and auto-sizing support.
 * @module packages/core/components/ui/textarea
 * @layer core
 *
 * @component
 * @example
 * import { Textarea } from '@saasflare/core';
 * <Textarea placeholder="Write your message..." />
 */
"use client"

import * as React from "react"
import { m } from "motion/react"
import { cn } from "../../lib/utils"

function Textarea({ className, ...props }: Omit<React.ComponentProps<"textarea">, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'>) {
  return (
    <m.textarea
      data-slot="textarea"
      whileFocus={{ boxShadow: "0 0 0 3px hsl(var(--ring) / 0.3)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,border-color] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        "field-sizing-content min-h-16",
        "focus-visible:border-ring",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
