// @draft
"use client"

/**
 * @fileoverview Saasflare Tracker — uptime/status segment grid.
 * @author Saasflare™
 *
 * Renders an array of equal-width segments, each colored by status. The
 * canonical use case is an uptime graph (each segment = one day, color =
 * up/down/degraded). Tooltips on hover surface the per-segment context.
 * A pattern shadcn/HeroUI/Mantine don't ship — popularized by Tremor.
 *
 * @module packages/ui/components/ui/tracker
 * @package ui
 * @layer core
 *
 * @example
 * <Tracker
 *   data={[
 *     { color: "emerald", tooltip: "Apr 1 — Operational" },
 *     { color: "emerald", tooltip: "Apr 2 — Operational" },
 *     { color: "amber",   tooltip: "Apr 3 — Degraded performance" },
 *     { color: "red",     tooltip: "Apr 4 — Major outage" },
 *   ]}
 * />
 */

import { type ReactNode } from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** Named colors map to OKLCH tokens — keeps trackers in-theme without
 * forcing consumers to import CSS vars by name. Pass any CSS color via
 * `color` to override. */
const NAMED_COLORS: Record<string, string> = {
    emerald: "oklch(0.68 0.17 155)",
    teal: "oklch(0.70 0.15 185)",
    blue: "oklch(0.65 0.18 230)",
    amber: "oklch(0.72 0.17 50)",
    red: "oklch(0.62 0.21 25)",
    rose: "oklch(0.65 0.20 10)",
    gray: "oklch(0.70 0 0)",
    neutral: "oklch(0.70 0 0)",
}

/** A single tracker block. */
export interface TrackerBlock {
    /** Named color key (emerald|teal|blue|amber|red|rose|gray) or any CSS color. */
    color?: string
    /** Tooltip text shown on hover. */
    tooltip?: ReactNode
    /** Custom key (helps React when blocks rearrange). */
    key?: string | number
}

/** Props for the Tracker component. */
export interface TrackerProps extends SaasflareComponentProps {
    /** Blocks to render, left-to-right. */
    data: TrackerBlock[]
    /** Height of each block in px. Default: `32`. */
    blockHeight?: number
    /** Gap between blocks in px. Default: `2`. */
    gap?: number
    /** Additional class names. */
    className?: string
}

/**
 * Status segment grid (uptime/incident timeline).
 *
 * @component
 * @layer core
 */
export function Tracker({
    data,
    blockHeight = 32,
    gap = 2,
    className,
    surface,
    radius,
    animated,
}: TrackerProps) {
    const sf = useSaasflareProps({ surface, radius, animated })

    return (
        <div
            data-slot="tracker"
            data-surface={sf.surface}
            data-radius={sf.radius}
            data-animated={String(sf.animated)}
            className={cn("flex w-full items-stretch", className)}
            style={{ gap, height: blockHeight }}
            role="group"
            aria-label="Status tracker"
        >
            {data.map((block, i) => {
                const color = block.color
                    ? NAMED_COLORS[block.color] ?? block.color
                    : NAMED_COLORS.gray
                return (
                    <div
                        key={block.key ?? i}
                        data-slot="tracker-block"
                        title={typeof block.tooltip === "string" ? block.tooltip : undefined}
                        className={cn(
                            "flex-1 rounded-sm transition-[transform,opacity]",
                            "hover:scale-y-110 hover:opacity-90",
                            "motion-reduce:hover:transform-none",
                        )}
                        style={{ backgroundColor: color }}
                    />
                )
            })}
        </div>
    )
}
