// @draft
"use client"

/**
 * @fileoverview Vertical timeline with scroll-driven beam animation.
 * @author Saasflare™
 * A chronological timeline where a beam progresses as the user scrolls.
 * Ideal for changelogs, roadmaps, and process steps.
 * @module packages/ui/components/ui/timeline
 * @package ui
 *
 * @component
 * @example
 * import { Timeline, TimelineItem } from '@saasflare/ui';
 * <Timeline>
 *   <TimelineItem title="v2.0 Released" date="March 2026">
 *     Major redesign with new dashboard.
 *   </TimelineItem>
 *   <TimelineItem title="v1.5 Released" date="January 2026">
 *     Added billing module.
 *   </TimelineItem>
 * </Timeline>
 */

import { useRef, type ReactNode } from "react"
import { m, useScroll, useTransform } from "framer-motion"
import { cn } from "../../lib/utils"
import { useReducedMotion } from "./motion-config"

/** Props for the Timeline container. */
export interface TimelineProps {
  /** TimelineItem children. */
  children: ReactNode
  /** Additional class names. */
  className?: string
}

/**
 * Vertical timeline with a scroll-driven progress beam.
 *
 * - Beam fills as the user scrolls through the timeline
 * - Each item fades in on scroll intersection
 * - Falls back to a static timeline when reduced motion is preferred
 *
 * @component
 * @package ui
 */
export function Timeline({ children, className }: TimelineProps) {
  const reduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"],
  })

  const beamHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      data-slot="timeline"
    >
      {/* Track line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-border md:left-1/2 md:-translate-x-px" />

      {/* Animated beam overlay */}
      {!reduced && (
        <m.div
          className="absolute left-4 top-0 w-0.5 bg-primary md:left-1/2 md:-translate-x-px"
          style={{ height: beamHeight }}
        />
      )}

      {/* Items */}
      <div className="relative space-y-12">{children}</div>
    </div>
  )
}

/** Props for a TimelineItem. */
export interface TimelineItemProps {
  /** Item title. */
  title: string
  /** Date or time label. */
  date?: string
  /** Item content/description. */
  children: ReactNode
  /** Additional class names. */
  className?: string
}

/**
 * Individual item within a Timeline.
 *
 * - Positioned alternating left/right on desktop, left-aligned on mobile
 * - Dot indicator on the timeline track
 * - Fades in when scrolled into view
 *
 * @component
 * @package ui
 */
export function TimelineItem({
  title,
  date,
  children,
  className,
}: TimelineItemProps) {
  const reduced = useReducedMotion()

  return (
    <m.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={reduced ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
      className={cn("relative pl-12 md:pl-0", className)}
      data-slot="timeline-item"
    >
      {/* Dot */}
      <div className="absolute left-[11px] top-1.5 size-3 rounded-full border-2 border-primary bg-background md:left-1/2 md:-translate-x-1.5" />

      {/* Content card */}
      <div className="md:ml-[calc(50%+2rem)] md:max-w-[calc(50%-3rem)]">
        {date && (
          <span className="mb-1 block text-sm text-muted-foreground">{date}</span>
        )}
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="mt-1 text-muted-foreground">{children}</div>
      </div>
    </m.div>
  )
}
