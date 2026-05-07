// @draft
"use client"

/**
 * @fileoverview Auto-rotating testimonial carousel with image and quote.
 * @author Saasflare™
 * Cycles through testimonials with smooth crossfade and slide animations.
 * Supports auto-play with configurable interval and manual navigation.
 * @module packages/ui/components/ui/animated/testimonials
 * @package ui
 *
 * @component
 * @example
 * import { AnimatedTestimonials } from '@saasflare/ui';
 * <AnimatedTestimonials
 *   testimonials={[
 *     { quote: "Amazing product!", name: "Jane Doe", role: "CEO", avatar: "/jane.jpg" },
 *     { quote: "10x faster.", name: "John Smith", role: "CTO", avatar: "/john.jpg" },
 *   ]}
 * />
 *
 * @example
 * // Without auto-play
 * <AnimatedTestimonials testimonials={items} autoPlay={false} />
 */

import { useState, useEffect, useCallback } from "react"
import { AnimatePresence, m } from "motion/react"
import { ChevronLeftIcon, ChevronRightIcon, QuoteIcon } from "lucide-react"
import { cn } from "../../../lib"
import { springGentle, noMotion, useReducedMotion } from "../motion-config"

/** A single testimonial entry. */
export interface Testimonial {
  /** The testimonial quote text. */
  quote: string
  /** Name of the person. */
  name: string
  /** Role/title of the person. */
  role: string
  /** Avatar image URL. */
  avatar?: string
  /** Company name. */
  company?: string
}

/** Props for the AnimatedTestimonials component. */
export interface AnimatedTestimonialsProps {
  /** Array of testimonials to display. */
  testimonials: Testimonial[]
  /** Auto-advance interval in milliseconds. Default: `5000` */
  interval?: number
  /** Whether to auto-play. Default: `true` */
  autoPlay?: boolean
  /** Additional class names. */
  className?: string
}

/**
 * Auto-rotating testimonial carousel with image, quote, and attribution.
 *
 * - Crossfades between testimonials with a horizontal slide
 * - Pauses auto-play on hover
 * - Accessible navigation buttons with keyboard support
 * - Shows static first testimonial when reduced motion is preferred
 *
 * @component
 * @package ui
 */
export function AnimatedTestimonials({
  testimonials,
  interval = 5000,
  autoPlay = true,
  className,
}: AnimatedTestimonialsProps) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  useEffect(() => {
    if (!autoPlay || paused || reduced) return
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [autoPlay, paused, reduced, interval, next])

  if (testimonials.length === 0) return null

  const current = testimonials[active]

  return (
    <div
      className={cn("relative mx-auto max-w-3xl", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      data-slot="animated-testimonials"
    >
      <div className="relative min-h-[220px] overflow-hidden rounded-2xl border bg-card p-8 shadow-sm md:p-12">
        <QuoteIcon
          className="absolute right-6 top-6 size-10 text-muted-foreground/10"
          aria-hidden="true"
        />

        <AnimatePresence mode="wait">
          <m.div
            key={active}
            initial={reduced ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: -20 }}
            transition={reduced ? noMotion : springGentle}
          >
            <blockquote className="mb-6 text-lg leading-relaxed text-foreground md:text-xl">
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            <div className="flex items-center gap-4">
              {current.avatar && (
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="size-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-semibold text-foreground">{current.name}</p>
                <p className="text-sm text-muted-foreground">
                  {current.role}
                  {current.company && ` at ${current.company}`}
                </p>
              </div>
            </div>
          </m.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {testimonials.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            className="rounded-full border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon className="size-4" />
          </button>

          {/* Dots */}
          <div className="flex gap-1.5" role="tablist" aria-label="Testimonials">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "size-2 rounded-full transition-all",
                  i === active
                    ? "w-6 bg-primary"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
                role="tab"
                aria-selected={i === active}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="rounded-full border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Next testimonial"
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}
