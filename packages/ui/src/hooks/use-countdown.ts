// @draft
"use client"

/**
 * @fileoverview Hook that returns a live countdown to a target date.
 * @author Saasflare™
 * @module packages/ui/hooks/use-countdown
 * @package ui
 *
 * @example
 * import { useCountdown } from '@saasflare/ui';
 * const { days, hours, minutes, seconds, isExpired } = useCountdown(new Date('2026-12-31'));
 */

import { useState, useEffect } from "react"

/** Return value of the useCountdown hook. */
export interface CountdownValue {
  /** Days remaining. */
  days: number
  /** Hours remaining (0–23). */
  hours: number
  /** Minutes remaining (0–59). */
  minutes: number
  /** Seconds remaining (0–59). */
  seconds: number
  /** Total milliseconds remaining. */
  totalMs: number
  /** Whether the target date has passed. */
  isExpired: boolean
}

/**
 * Returns a live countdown to a target date, updating every second.
 *
 * @param {Date | string | number} target - The target date/time
 * @returns {CountdownValue} The current countdown values
 *
 * @example
 * const { days, hours, minutes, seconds } = useCountdown('2026-12-31T00:00:00');
 */
export function useCountdown(target: Date | string | number): CountdownValue {
  const targetMs = new Date(target).getTime()

  const calculate = (): CountdownValue => {
    const diff = Math.max(0, targetMs - Date.now())
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      totalMs: diff,
      isExpired: diff <= 0,
    }
  }

  const [value, setValue] = useState<CountdownValue>(calculate)

  useEffect(() => {
    const timer = setInterval(() => {
      const next = calculate()
      setValue(next)
      if (next.isExpired) clearInterval(timer)
    }, 1000)
    return () => clearInterval(timer)
  }, [targetMs])

  return value
}
