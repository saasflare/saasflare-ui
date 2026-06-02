"use client"

/**
 * @fileoverview Testimonial card with avatar, quote, and optional star rating.
 * @author Saasflare™
 * @module packages/ui/components/ui/testimonial-card
 * @package ui
 *
 * @component
 * @example
 * import { TestimonialCard } from '@saasflare/ui';
 * <TestimonialCard
 *   quote="Amazing product!"
 *   name="Jane Doe"
 *   role="CEO at Acme"
 *   avatar="/jane.jpg"
 *   rating={5}
 * />
 */

import * as React from "react"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** Props for the TestimonialCard component. */
export interface TestimonialCardProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** The testimonial quote text. */
  quote: string
  /** Name of the person. */
  name: string
  /** Role/title of the person. */
  role?: string
  /** Avatar image URL. */
  avatar?: string
  /** Star rating (1–5). Omit to hide stars. */
  rating?: 1 | 2 | 3 | 4 | 5
}

/**
 * Testimonial card with avatar, quote, attribution, and optional star rating.
 *
 * @component
 * @package ui
 */
export function TestimonialCard({
  quote,
  name,
  role,
  avatar,
  rating,
  className,
  surface,
  radius,
  animated,
  ...props
}: TestimonialCardProps) {
  const sf = useSaasflareProps({ surface, radius, animated })
  return (
    <div
      data-slot="testimonial-card"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "flex flex-col rounded-xl border surface-card p-6",
        "transition-all duration-200 hover:-translate-y-px hover:shadow-md",
        "motion-reduce:hover:transform-none",
        className,
      )}
      {...props}
    >
      {rating && (
        <div className="mb-3 flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, i) => (
            <svg
              key={i}
              className={cn("size-4", i < rating ? "text-warning" : "text-muted-foreground/20")}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}

      <blockquote className="flex-1 text-sm leading-relaxed text-foreground">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <div className="mt-4 flex items-center gap-3">
        {avatar && (
          <img
            src={avatar}
            alt={name}
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />
        )}
        <div>
          <p className="text-sm font-semibold">{name}</p>
          {role && <p className="text-xs text-muted-foreground">{role}</p>}
        </div>
      </div>
    </div>
  )
}
