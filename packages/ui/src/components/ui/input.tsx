// @toreview
/**
 * @fileoverview Input — premium text input with Framer Motion animated focus ring and spring transition for polished form interactions.
 * @module packages/core/components/ui/input
 * @layer core
 *
 * @component
 * @example
 * import { Input } from '@saasflare/core';
 *
 * <Input type="email" placeholder="you@example.com" />
 */
"use client"

import * as React from "react"
import { m } from "framer-motion"
import { cn } from "../../lib/utils"

function Input({ className, type, ...props }: Omit<React.ComponentProps<"input">, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'>) {
  return (
    <m.input
      type={type}
      data-slot="input"
      whileFocus={{ boxShadow: "0 0 0 3px hsl(var(--ring) / 0.3)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,border-color] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        "focus-visible:border-ring",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
