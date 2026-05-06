// @draft
"use client"

/**
 * @fileoverview Animated bento grid layout component.
 * @author Saasflare™
 * A responsive grid layout with staggered entrance animations, inspired by
 * the Apple-style bento grid. Items can span multiple columns/rows.
 * @module packages/ui/components/ui/bento-grid
 * @package ui
 *
 * @component
 * @example
 * import { BentoGrid, BentoGridItem } from '@saasflare/ui';
 * <BentoGrid>
 *   <BentoGridItem colSpan={2}>Wide card</BentoGridItem>
 *   <BentoGridItem rowSpan={2}>Tall card</BentoGridItem>
 *   <BentoGridItem>Standard card</BentoGridItem>
 * </BentoGrid>
 *
 * @example
 * // Custom grid columns
 * <BentoGrid columns={4} gap={6}>
 *   <BentoGridItem colSpan={2} rowSpan={2}>Featured</BentoGridItem>
 *   <BentoGridItem>Small 1</BentoGridItem>
 *   <BentoGridItem>Small 2</BentoGridItem>
 * </BentoGrid>
 */

import { type ReactNode } from "react"
import { m } from "motion/react"
import { cn } from "../../lib/utils"
import { springGentle, noMotion, useReducedMotion } from "./motion-config"

/** Props for the BentoGrid container. */
export interface BentoGridProps {
  /** Grid items. */
  children: ReactNode
  /** Number of columns at md+ breakpoint. Default: `3` */
  columns?: 2 | 3 | 4
  /** Gap between items in Tailwind spacing units (4 = 1rem). Default: `4` */
  gap?: number
  /** Additional class names. */
  className?: string
}

/** Column class map for the grid container. */
const COL_MAP: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
}

/**
 * Responsive bento-style grid container with staggered item entrance.
 *
 * - Items animate in with a staggered fade+slide
 * - Supports 2, 3, or 4 column layouts (1 column on mobile)
 * - Items can span multiple columns/rows via BentoGridItem
 *
 * @component
 * @package ui
 */
export function BentoGrid({
  children,
  columns = 3,
  gap = 4,
  className,
}: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1",
        COL_MAP[columns],
        className,
      )}
      style={{ gap: `${gap * 0.25}rem` }}
      data-slot="bento-grid"
    >
      {children}
    </div>
  )
}

/** Props for a BentoGridItem. */
export interface BentoGridItemProps {
  /** Item content. */
  children: ReactNode
  /** Number of columns to span (1–4). Default: `1` */
  colSpan?: 1 | 2 | 3 | 4
  /** Number of rows to span (1–3). Default: `1` */
  rowSpan?: 1 | 2 | 3
  /** Stagger delay index (multiply by 0.08 for delay). Default: `0` */
  index?: number
  /** Additional class names. */
  className?: string
}

/** Tailwind column span classes. */
const COL_SPAN_MAP: Record<number, string> = {
  1: "",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
}

/** Tailwind row span classes. */
const ROW_SPAN_MAP: Record<number, string> = {
  1: "",
  2: "md:row-span-2",
  3: "md:row-span-3",
}

/**
 * Individual item within a BentoGrid.
 *
 * - Supports column and row spanning
 * - Animates in with a staggered fade + vertical slide
 * - Pass `index` for stagger ordering
 *
 * @component
 * @package ui
 */
export function BentoGridItem({
  children,
  colSpan = 1,
  rowSpan = 1,
  index = 0,
  className,
}: BentoGridItemProps) {
  const reduced = useReducedMotion()

  return (
    <m.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={reduced ? noMotion : { ...springGentle, delay: index * 0.08 }}
      className={cn(
        "rounded-card border border-border-subtle bg-glass-2 p-6 text-card-foreground",
        "transition-all duration-200 hover:border-border-hover hover:shadow-card-hover hover:-translate-y-px",
        "motion-reduce:hover:transform-none",
        COL_SPAN_MAP[colSpan],
        ROW_SPAN_MAP[rowSpan],
        className,
      )}
      data-slot="bento-grid-item"
    >
      {children}
    </m.div>
  )
}
