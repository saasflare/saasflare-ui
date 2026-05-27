// @draft
"use client"

/**
 * @fileoverview Saasflare CategoryBar — segmented progress bar.
 * @author Saasflare™
 *
 * One horizontal bar split into adjacent colored segments — useful for
 * resource breakdowns (disk usage by category, traffic by source, budget
 * allocation). Each segment can carry a value, color, and label;
 * percentages auto-normalize to fill the bar.
 *
 * @module packages/ui/components/ui/category-bar
 * @package ui
 * @layer core
 *
 * @example
 * <CategoryBar
 *   segments={[
 *     { value: 30, color: "oklch(0.65 0.18 230)", label: "Images" },
 *     { value: 20, color: "oklch(0.72 0.17 50)",  label: "Docs"   },
 *     { value: 50, color: "oklch(0.70 0 0)",      label: "Other"  },
 *   ]}
 *   showLabels
 * />
 */

import { m } from "motion/react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springGentle } from "./motion-config"

/** A single segment of the bar. */
export interface CategoryBarSegment {
    /** Numeric value driving the segment width (auto-normalized). */
    value: number
    /** Any CSS color. Falls back to a derived primary tint. */
    color?: string
    /** Optional label shown below the segment when `showLabels` is true. */
    label?: string
}

/** Props for the CategoryBar component. */
export interface CategoryBarProps extends SaasflareComponentProps {
    /** Segments to render, left-to-right. */
    segments: CategoryBarSegment[]
    /** Bar height in pixels. Default: `8`. */
    height?: number
    /** Render labels + percentages under each segment. */
    showLabels?: boolean
    /** Formats the percentage text. Default: `"NN%"`. */
    valueFormatter?: (percent: number) => string
    /** Additional class names. */
    className?: string
    /** Accessible label for the bar group. */
    "aria-label"?: string
}

/** Fallback palette — used when a segment has no color. */
const FALLBACK_COLORS = [
    "oklch(0.65 0.18 230)", // blue
    "oklch(0.72 0.17 50)", // amber
    "oklch(0.68 0.17 155)", // emerald
    "oklch(0.62 0.21 25)", // red
    "oklch(0.65 0.20 290)", // violet
    "oklch(0.70 0.15 185)", // teal
]

/**
 * Segmented progress bar with optional labels.
 *
 * @component
 * @layer core
 */
export function CategoryBar({
    segments,
    height = 8,
    showLabels = false,
    valueFormatter,
    className,
    surface,
    radius,
    animated,
    "aria-label": ariaLabel,
}: CategoryBarProps) {
    const sf = useSaasflareProps({ surface, radius, animated })
    const motion = useSaasflareMotion(sf.animated, springGentle)

    const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0)
    if (total === 0 || segments.length === 0) return null

    const formatter =
        valueFormatter ?? ((p: number) => `${p.toFixed(p < 10 ? 1 : 0)}%`)

    return (
        <div
            data-slot="category-bar"
            data-surface={sf.surface}
            data-radius={sf.radius}
            data-animated={String(sf.animated)}
            role="group"
            aria-label={ariaLabel ?? "Category breakdown"}
            className={cn("w-full", className)}
        >
            <div
                data-slot="category-bar-track"
                className="flex w-full overflow-hidden rounded-full bg-primary/10"
                style={{ height }}
            >
                {segments.map((seg, i) => {
                    const pct = (Math.max(0, seg.value) / total) * 100
                    return (
                        <m.div
                            key={i}
                            data-slot="category-bar-segment"
                            title={
                                seg.label
                                    ? `${seg.label}: ${formatter(pct)}`
                                    : formatter(pct)
                            }
                            initial={motion.disabled ? false : { width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={motion.transition}
                            className="h-full"
                            style={{
                                backgroundColor:
                                    seg.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
                            }}
                        />
                    )
                })}
            </div>
            {showLabels && (
                <div
                    data-slot="category-bar-labels"
                    className="mt-2 flex w-full text-xs text-muted-foreground"
                >
                    {segments.map((seg, i) => {
                        const pct = (Math.max(0, seg.value) / total) * 100
                        return (
                            <div
                                key={i}
                                data-slot="category-bar-label"
                                style={{ width: `${pct}%` }}
                                className="flex min-w-0 items-center gap-1.5 truncate px-1"
                            >
                                <span
                                    aria-hidden="true"
                                    className="size-2 shrink-0 rounded-full"
                                    style={{
                                        backgroundColor:
                                            seg.color ??
                                            FALLBACK_COLORS[i % FALLBACK_COLORS.length],
                                    }}
                                />
                                <span className="truncate">
                                    {seg.label ? `${seg.label} ` : ""}
                                    <span className="text-foreground font-medium tabular-nums">
                                        {formatter(pct)}
                                    </span>
                                </span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
