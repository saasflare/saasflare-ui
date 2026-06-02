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

import React, { useState, useEffect, useCallback } from "react"
import { AnimatePresence, m } from "motion/react"
import { CaretLeftIcon, CaretRightIcon, QuotesIcon } from "../phosphor"
import { cn } from "../../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../../providers"
import { springGentle, useSaasflareMotion } from "../motion-config"

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
export interface AnimatedTestimonialsProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
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
 * - Honors the `animated` axis and OS reduced-motion: when disabled the
 *   crossfade and auto-advance are skipped (static, manual-only)
 *
 * @component
 * @package ui
 */
export function AnimatedTestimonials({
  testimonials,
  interval = 5000,
  autoPlay = true,
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...rest
}: AnimatedTestimonialsProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const motion = useSaasflareMotion(sf.animated, springGentle)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  useEffect(() => {
    if (!autoPlay || paused || motion.disabled) return
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [autoPlay, paused, motion.disabled, interval, next])

  if (testimonials.length === 0) return null

  const current = testimonials[active]

  return (
    <div
      {...rest}
      className={cn("relative mx-auto max-w-3xl", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      data-slot="animated-testimonials"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
    >
      <div className="relative min-h-[220px] overflow-hidden rounded-2xl border bg-card p-8 shadow-sm md:p-12">
        <QuotesIcon
          weight={sf.iconWeight}
          className="absolute right-6 top-6 size-10 text-muted-foreground/10"
          aria-hidden="true"
        />

        <AnimatePresence mode="wait">
          <m.div
            key={active}
            initial={motion.disabled ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={motion.disabled ? { opacity: 0 } : { opacity: 0, x: -20 }}
            transition={motion.transition}
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
            <CaretLeftIcon weight={sf.iconWeight} className="size-4" />
          </button>

          {/* Dots */}
          <div className="flex gap-1.5" role="group" aria-label="Testimonials">
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
                aria-current={i === active}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="rounded-full border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Next testimonial"
          >
            <CaretRightIcon weight={sf.iconWeight} className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}
