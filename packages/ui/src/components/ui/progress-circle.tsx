// @draft
"use client"

/**
 * @fileoverview Saasflare ProgressCircle — circular progress indicator.
 * @author Saasflare™
 *
 * The radial counterpart to Progress. Sized via the `size` prop; stroke
 * width auto-scales but can be overridden. Renders an SVG ring with a
 * smooth spring animation from 0% to the current value. Optionally
 * displays a center label (the consumer's children).
 *
 * @module packages/ui/components/ui/progress-circle
 * @package ui
 * @layer core
 *
 * @example
 * <ProgressCircle value={72} />
 *
 * @example
 * <ProgressCircle value={45} size="lg">
 *   <span className="text-sm font-semibold">45%</span>
 * </ProgressCircle>
 */

import { type ReactNode } from "react"
import { m } from "motion/react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springGentle } from "./motion-config"

const SIZE_PX = {
    sm: 48,
    md: 64,
    lg: 96,
    xl: 128,
} as const

export type ProgressCircleSize = keyof typeof SIZE_PX

/** Props for the ProgressCircle component. */
export interface ProgressCircleProps extends SaasflareComponentProps {
    /** Current value in the range `[0, max]`. */
    value: number
    /** Maximum value. Default: `100`. */
    max?: number
    /** Size preset. Default: `"md"`. */
    size?: ProgressCircleSize
    /** Ring stroke width in pixels. Default: derived from `size`. */
    strokeWidth?: number
    /** Center content (e.g. the numeric label). */
    children?: ReactNode
    /** Additional class names on the outer wrapper. */
    className?: string
    /** Accessible label. Default: `"<value>%"`. */
    "aria-label"?: string
}

/**
 * Circular progress indicator. Drop-in radial counterpart to Progress.
 *
 * @component
 * @layer core
 *
 * @example
 * <ProgressCircle value={72} />
 */
export function ProgressCircle({
    value,
    max = 100,
    size = "md",
    strokeWidth,
    children,
    className,
    surface,
    radius,
    animated,
    "aria-label": ariaLabel,
}: ProgressCircleProps) {
    const sf = useSaasflareProps({ surface, radius, animated })
    const motion = useSaasflareMotion(sf.animated, springGentle)

    const px = SIZE_PX[size]
    const sw = strokeWidth ?? Math.max(3, Math.round(px / 12))
    const radiusPx = (px - sw) / 2
    const circumference = 2 * Math.PI * radiusPx
    const clamped = Math.min(Math.max(value, 0), max)
    const percent = (clamped / max) * 100
    const dashOffset = circumference * (1 - clamped / max)

    return (
        <div
            data-slot="progress-circle"
            data-size={size}
            data-surface={sf.surface}
            data-animated={String(sf.animated)}
            role="progressbar"
            aria-valuenow={clamped}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={ariaLabel ?? `${Math.round(percent)}%`}
            className={cn("relative inline-flex items-center justify-center", className)}
            style={{ width: px, height: px }}
        >
            <svg
                width={px}
                height={px}
                viewBox={`0 0 ${px} ${px}`}
                className="-rotate-90"
            >
                <circle
                    data-slot="progress-circle-track"
                    cx={px / 2}
                    cy={px / 2}
                    r={radiusPx}
                    fill="none"
                    strokeWidth={sw}
                    className="stroke-primary/15"
                />
                <m.circle
                    data-slot="progress-circle-indicator"
                    cx={px / 2}
                    cy={px / 2}
                    r={radiusPx}
                    fill="none"
                    strokeWidth={sw}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    className="stroke-primary"
                    initial={motion.disabled ? false : { strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={motion.transition}
                />
            </svg>
            {children !== undefined && (
                <div
                    data-slot="progress-circle-label"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                    {children}
                </div>
            )}
        </div>
    )
}
