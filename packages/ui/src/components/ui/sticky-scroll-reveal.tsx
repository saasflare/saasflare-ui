// @draft
"use client"

/**
 * @fileoverview Sticky scroll reveal — left text stays, right content scrolls.
 * @author Saasflare™
 * A split layout where the left column stays fixed while the right column
 * scrolls through content items. Great for feature walkthroughs.
 * @module packages/ui/components/ui/sticky-scroll-reveal
 * @package ui
 *
 * @component
 * @example
 * import { StickyScrollReveal } from '@saasflare/ui';
 * <StickyScrollReveal
 *   items={[
 *     { title: "Step 1", description: "Connect your data", content: <img src="/step1.png" /> },
 *     { title: "Step 2", description: "Configure your pipeline", content: <img src="/step2.png" /> },
 *   ]}
 * />
 */

import { useRef, type ReactNode } from "react"
import { m, useScroll, useTransform } from "framer-motion"
import { cn } from "../../lib/utils"
import { useReducedMotion } from "./motion-config"

/** A single item in the sticky scroll reveal. */
export interface StickyScrollItem {
  /** Section title. */
  title: string
  /** Section description text. */
  description: string
  /** Visual content (image, component, etc.) shown in the right column. */
  content?: ReactNode
}

/** Props for the StickyScrollReveal component. */
export interface StickyScrollRevealProps {
  /** Array of scroll items. */
  items: StickyScrollItem[]
  /** Additional class names. */
  className?: string
}

/**
 * Split layout with sticky left text and scrolling right content.
 *
 * - Left column text stays fixed during scroll
 * - Right column content transitions between items
 * - Each item fades in based on scroll position
 * - Falls back to stacked layout when reduced motion is preferred
 *
 * @component
 * @package ui
 */
export function StickyScrollReveal({
  items,
  className,
}: StickyScrollRevealProps) {
  const reduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  if (reduced) {
    return (
      <div className={cn("space-y-16", className)} data-slot="sticky-scroll-reveal">
        {items.map((item, i) => (
          <div key={i} className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold">{item.title}</h3>
              <p className="mt-2 text-muted-foreground">{item.description}</p>
            </div>
            {item.content && (
              <div className="rounded-xl border bg-muted/50 p-4">{item.content}</div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      data-slot="sticky-scroll-reveal"
    >
      <div className="relative grid gap-8 md:grid-cols-2">
        {/* Left column — sticky text */}
        <div className="relative md:h-fit">
          <div className="sticky top-32 space-y-24">
            {items.map((item, i) => (
              <StickyItem
                key={i}
                item={item}
                index={i}
                total={items.length}
                containerRef={containerRef}
              />
            ))}
          </div>
        </div>

        {/* Right column — scrolling content */}
        <div className="space-y-24">
          {items.map((item, i) => (
            <div key={i} className="sticky top-32">
              <StickyContent
                content={item.content}
                index={i}
                total={items.length}
                containerRef={containerRef}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Internal: animated text item. */
function StickyItem({
  item,
  index,
  total,
  containerRef,
}: {
  item: StickyScrollItem
  index: number
  total: number
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const sectionStart = index / total
  const sectionEnd = (index + 1) / total
  const opacity = useTransform(
    scrollYProgress,
    [sectionStart, sectionStart + 0.05, sectionEnd - 0.05, sectionEnd],
    [0.3, 1, 1, 0.3],
  )

  return (
    <m.div style={{ opacity }}>
      <h3 className="text-2xl font-bold">{item.title}</h3>
      <p className="mt-2 text-muted-foreground">{item.description}</p>
    </m.div>
  )
}

/** Internal: animated content panel. */
function StickyContent({
  content,
  index,
  total,
  containerRef,
}: {
  content?: ReactNode
  index: number
  total: number
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const sectionStart = index / total
  const sectionEnd = (index + 1) / total
  const opacity = useTransform(
    scrollYProgress,
    [sectionStart, sectionStart + 0.05, sectionEnd - 0.05, sectionEnd],
    [0, 1, 1, 0],
  )

  if (!content) return null

  return (
    <m.div
      style={{ opacity }}
      className="overflow-hidden rounded-xl border bg-muted/50 p-4"
    >
      {content}
    </m.div>
  )
}
