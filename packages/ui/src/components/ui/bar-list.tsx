// @draft
"use client"

/**
 * @fileoverview Saasflare BarList — horizontal "top N" rankings.
 * @author Saasflare™
 *
 * Each row renders a horizontal bar whose fill width is proportional to the
 * largest value in the list. Useful for "top countries", "top pages",
 * "top errors" style dashboard widgets — a pattern shadcn doesn't ship but
 * Tremor popularized.
 *
 * @module packages/ui/components/ui/bar-list
 * @package ui
 * @layer core
 *
 * @example
 * <BarList
 *   data={[
 *     { name: "Germany", value: 4321 },
 *     { name: "United States", value: 3210 },
 *     { name: "Brazil", value: 2987 },
 *   ]}
 *   valueFormatter={(n) => n.toLocaleString()}
 * />
 */

import { type ReactNode } from "react"
import { m } from "motion/react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springGentle } from "./motion-config"

/** A single row in the list. */
export interface BarListItem {
    /** Row label. */
    name: string
    /** Numeric value driving the bar width. */
    value: number
    /** Optional icon shown left of the label. */
    icon?: ReactNode
    /** Optional click target for the row label (wraps in `<a>`). */
    href?: string
    /** Optional per-row color override (any CSS color). */
    color?: string
}

/** Props for the BarList component. */
export interface BarListProps extends SaasflareComponentProps {
    /** Rows to render. */
    data: BarListItem[]
    /** Formats the numeric value on the right edge. Default: `String(n)`. */
    valueFormatter?: (value: number) => string
    /** Sort rows by value descending. Default: `true`. */
    sortDescending?: boolean
    /** Maximum rows rendered (truncates after sort). */
    limit?: number
    /** Additional class names. */
    className?: string
}

/**
 * Horizontal bar list — common dashboard "top N" rankings pattern.
 *
 * @component
 * @layer core
 */
export function BarList({
    data,
    valueFormatter = (n) => n.toLocaleString(),
    sortDescending = true,
    limit,
    className,
    surface,
    radius,
    animated,
}: BarListProps) {
    const sf = useSaasflareProps({ surface, radius, animated })
    const motion = useSaasflareMotion(sf.animated, springGentle)

    const sorted = sortDescending ? [...data].sort((a, b) => b.value - a.value) : data
    const visible = typeof limit === "number" ? sorted.slice(0, limit) : sorted
    const peak = visible.reduce((max, row) => Math.max(max, row.value), 0) || 1

    return (
        <div
            data-slot="bar-list"
            data-surface={sf.surface}
            data-radius={sf.radius}
            data-animated={String(sf.animated)}
            className={cn("flex flex-col gap-1.5", className)}
        >
            {visible.map((row, i) => {
                const pct = (row.value / peak) * 100
                const labelClasses = cn(
                    "relative z-10 flex flex-1 items-center gap-2 truncate px-2 text-sm",
                    row.href && "hover:underline",
                )
                const labelInner = (
                    <>
                        {row.icon !== undefined && (
                            <span className="flex shrink-0 items-center [&_svg]:size-4">
                                {row.icon}
                            </span>
                        )}
                        <span className="truncate">{row.name}</span>
                    </>
                )
                return (
                    <div
                        key={`${row.name}-${i}`}
                        data-slot="bar-list-item"
                        className="relative flex h-8 items-center"
                    >
                        <m.div
                            data-slot="bar-list-bar"
                            className="absolute inset-y-0 left-0 rounded-md bg-primary/15"
                            style={
                                row.color
                                    ? { backgroundColor: row.color, opacity: 0.18 }
                                    : undefined
                            }
                            initial={motion.disabled ? false : { width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={motion.transition}
                        />
                        {row.href ? (
                            <a
                                href={row.href}
                                data-slot="bar-list-label"
                                className={labelClasses}
                            >
                                {labelInner}
                            </a>
                        ) : (
                            <span data-slot="bar-list-label" className={labelClasses}>
                                {labelInner}
                            </span>
                        )}
                        <span
                            data-slot="bar-list-value"
                            className="relative z-10 shrink-0 px-2 text-sm font-medium tabular-nums"
                        >
                            {valueFormatter(row.value)}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
