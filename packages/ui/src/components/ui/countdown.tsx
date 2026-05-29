"use client"

/**
 * @fileoverview Countdown timer display with days/hours/minutes/seconds boxes.
 * @author Saasflare™
 * Presentational component — pair with the `useCountdown` hook for live ticking.
 * @module packages/ui/components/ui/countdown
 * @package ui
 *
 * @component
 * @example
 * import { Countdown } from '@saasflare/ui';
 * import { useCountdown } from '@saasflare/ui';
 * const { days, hours, minutes, seconds } = useCountdown(targetDate);
 * <Countdown days={days} hours={hours} minutes={minutes} seconds={seconds} />
 */

import { cn } from "../../lib"

/** Props for the Countdown component. */
export interface CountdownProps {
  /** Number of days remaining. */
  days: number
  /** Number of hours remaining (0–23). */
  hours: number
  /** Number of minutes remaining (0–59). */
  minutes: number
  /** Number of seconds remaining (0–59). */
  seconds: number
  /** Show the labels below each box. Default: `true` */
  showLabels?: boolean
  /** Additional class names. */
  className?: string
}

/** Pads a number to 2 digits. */
function pad(n: number): string {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0")
}

/**
 * Countdown display with segmented boxes for each time unit.
 *
 * @component
 * @package ui
 */
export function Countdown({
  days,
  hours,
  minutes,
  seconds,
  showLabels = true,
  className,
}: CountdownProps) {
  const units = [
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Minutes" },
    { value: seconds, label: "Seconds" },
  ]

  return (
    <div
      className={cn("flex items-center gap-2 md:gap-3", className)}
      data-slot="countdown"
      role="timer"
      aria-label={`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}
    >
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2 md:gap-3">
          <div className="flex flex-col items-center">
            <div className="flex size-14 items-center justify-center rounded-lg border bg-card text-2xl font-bold tabular-nums shadow-sm md:size-16 md:text-3xl">
              {pad(unit.value)}
            </div>
            {showLabels && (
              <span className="mt-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                {unit.label}
              </span>
            )}
          </div>
          {i < units.length - 1 && (
            <span className="mb-5 text-xl font-bold text-muted-foreground" aria-hidden="true">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
