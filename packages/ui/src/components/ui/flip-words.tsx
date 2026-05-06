// @draft
"use client"

/**
 * @fileoverview Rotating word animation — "Build [websites/apps/products] faster".
 * @author Saasflare™
 * Cycles through an array of words with a vertical flip animation.
 * The container auto-sizes to the longest word to prevent layout shifts.
 * @module packages/ui/components/ui/flip-words
 * @package ui
 *
 * @component
 * @example
 * import { FlipWords } from '@saasflare/ui';
 * <h1>
 *   Build <FlipWords words={["websites", "apps", "products"]} /> faster
 * </h1>
 *
 * @example
 * // Custom interval and color
 * <FlipWords
 *   words={["scalable", "reliable", "beautiful"]}
 *   interval={3000}
 *   className="text-primary"
 * />
 */

import { useState, useEffect, useCallback, useMemo } from "react"
import { AnimatePresence, m } from "framer-motion"
import { cn } from "../../lib/utils"
import { springBouncy, noMotion, useReducedMotion } from "./motion-config"

/** Props for the FlipWords component. */
export interface FlipWordsProps {
  /** Array of words to cycle through. */
  words: string[]
  /** Cycle interval in milliseconds. Default: `2500` */
  interval?: number
  /** Additional class names. */
  className?: string
}

/**
 * Inline word rotator with vertical flip animation.
 *
 * - Words flip upward with a spring transition
 * - Container width matches the longest word to prevent layout shifts
 * - Falls back to showing the first word statically when reduced motion is preferred
 * - Renders inline, so it can be placed mid-sentence
 *
 * @component
 * @package ui
 */
export function FlipWords({
  words,
  interval = 2500,
  className,
}: FlipWordsProps) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % words.length)
  }, [words.length])

  useEffect(() => {
    if (reduced || words.length <= 1) return
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [reduced, words.length, interval, next])

  // Invisible spacer with the longest word to prevent layout shifts
  const longestWord = useMemo(
    () => words.reduce((a, b) => (a.length >= b.length ? a : b), ""),
    [words],
  )

  if (reduced) {
    return <span className={className}>{words[0]}</span>
  }

  return (
    <span
      className={cn("relative inline-block text-left align-baseline", className)}
      data-slot="flip-words"
    >
      {/* Invisible spacer for width */}
      <span className="invisible" aria-hidden="true">{longestWord}</span>

      <AnimatePresence mode="wait">
        <m.span
          key={words[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={springBouncy}
          className="absolute inset-0"
          aria-live="polite"
        >
          {words[index]}
        </m.span>
      </AnimatePresence>
    </span>
  )
}
