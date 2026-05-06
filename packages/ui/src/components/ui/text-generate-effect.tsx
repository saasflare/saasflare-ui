// @draft
"use client"

/**
 * @fileoverview Text that fades in word by word with staggered timing.
 * @author Saasflare™
 * Splits text into words and animates each one sequentially, creating
 * a "generate" or "type" appearance effect. Ideal for hero headlines.
 * @module packages/ui/components/ui/text-generate-effect
 * @package ui
 *
 * @component
 * @example
 * import { TextGenerateEffect } from '@saasflare/ui';
 * <TextGenerateEffect text="Build your SaaS in record time" />
 *
 * @example
 * // Slower generation with custom tag
 * <TextGenerateEffect
 *   text="Ship faster. Scale better. Sleep more."
 *   stagger={0.08}
 *   as="h1"
 *   className="text-4xl font-bold"
 * />
 */

import { useMemo, useRef } from "react"
import { m, useInView } from "framer-motion"
import { cn } from "../../lib/utils"
import { useReducedMotion } from "./motion-config"

/** Props for the TextGenerateEffect component. */
export interface TextGenerateEffectProps {
  /** Text string to animate word by word. */
  text: string
  /** Delay between each word in seconds. Default: `0.05` */
  stagger?: number
  /** Duration per word fade-in in seconds. Default: `0.4` */
  duration?: number
  /** Whether animation triggers only once. Default: `true` */
  once?: boolean
  /** HTML element to render. Default: `"p"` */
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "span"
  /** Additional class names. */
  className?: string
}

/**
 * Text that reveals word by word with staggered fade-in.
 *
 * - Each word fades from transparent to opaque sequentially
 * - Triggers when the element scrolls into view
 * - Renders full text immediately when reduced motion is preferred
 * - Preserves natural text wrapping and spacing
 *
 * @component
 * @package ui
 */
export function TextGenerateEffect({
  text,
  stagger = 0.05,
  duration = 0.4,
  once = true,
  as: Tag = "p",
  className,
}: TextGenerateEffectProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once, margin: "-50px" })

  const words = useMemo(() => text.split(/\s+/), [text])

  if (reduced) {
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <Tag
      ref={ref as React.RefObject<HTMLParagraphElement>}
      className={cn("inline", className)}
      data-slot="text-generate-effect"
    >
      {words.map((word, i) => (
        <m.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={
            isInView
              ? { opacity: 1, filter: "blur(0px)" }
              : { opacity: 0, filter: "blur(4px)" }
          }
          transition={{ duration, delay: i * stagger }}
          className="inline-block"
        >
          {word}
          {i < words.length - 1 && "\u00A0"}
        </m.span>
      ))}
    </Tag>
  )
}
