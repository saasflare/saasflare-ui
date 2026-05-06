// @toreview
"use client"

/**
 * @fileoverview Saasflare Card — surface container with optional hover lift.
 * @module packages/core/components/ui/card
 * @layer core
 *
 * Self-contained implementation. Does NOT import from ui/.
 * Hover lift animation respects reduced-motion preference.
 *
 * @example
 * import { Card, CardHeader, CardTitle, CardContent } from "@saasflare/core";
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Settings</CardTitle>
 *   </CardHeader>
 *   <CardContent>...</CardContent>
 * </Card>
 */

import * as React from "react"
import { m } from "framer-motion"
import { cn } from "../../lib/utils"
import { springGentle, noMotion, useReducedMotion } from "./motion-config"

/**
 * Card container with subtle hover-lift animation.
 *
 * @component
 * @layer core
 *
 * @example
 * <Card className="max-w-sm">
 *   <CardHeader><CardTitle>Plan</CardTitle></CardHeader>
 *   <CardContent>Content here</CardContent>
 * </Card>
 */
/** Framer-motion event overrides that conflict with React HTML events */
type MotionConflicts = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"

function Card({ className, ...props }: Omit<React.ComponentProps<"div">, MotionConflicts>) {
  const reduced = useReducedMotion()

  return (
    <m.div
      data-slot="card"
      whileHover={reduced ? undefined : { y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
      transition={reduced ? noMotion : springGentle}
      className={cn(
        "flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm transition-[border-color] duration-300 hover:border-primary/20",
        className
      )}
      {...props}
    />
  )
}

/**
 * Card header with grid layout supporting an optional action slot.
 *
 * @component
 * @layer core
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

/**
 * Card title text.
 *
 * @component
 * @layer core
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

/**
 * Card description / subtitle text.
 *
 * @component
 * @layer core
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

/**
 * Card action slot — positioned top-right in the header.
 *
 * @component
 * @layer core
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * Card main content area.
 *
 * @component
 * @layer core
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

/**
 * Card footer — bottom-aligned actions.
 *
 * @component
 * @layer core
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
