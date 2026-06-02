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

import * as React from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** Named status colors map to semantic, theme-aware design tokens — keeps
 * trackers in-theme (light/dark + active palette) without forcing consumers
 * to import CSS vars by name. Pass any CSS color via `color` to override. */
const NAMED_COLORS: Record<string, string> = {
    emerald: "var(--success)",
    teal: "var(--success)",
    blue: "var(--info)",
    amber: "var(--warning)",
    red: "var(--destructive)",
    rose: "var(--destructive)",
    gray: "var(--muted)",
    neutral: "var(--muted)",
}

/** A single tracker block. */
export interface TrackerBlock {
    /**
     * Named status key — resolves to a semantic, theme-aware token:
     * `emerald`/`teal` → success, `blue` → info, `amber` → warning,
     * `red`/`rose` → destructive, `gray`/`neutral` → muted. Or pass any CSS
     * color string to override with an explicit value.
     */
    color?: string
    /** Tooltip text shown on hover. */
    tooltip?: React.ReactNode
    /** Custom key (helps React when blocks rearrange). */
    key?: string | number
}

/** Props for the Tracker component. */
export interface TrackerProps
    extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
        SaasflareComponentProps {
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
    style,
    ...props
}: TrackerProps) {
    const sf = useSaasflareProps({ surface, radius, animated })

    return (
        <div
            {...props}
            data-slot="tracker"
            data-surface={sf.surface}
            data-radius={sf.radius}
            data-animated={String(sf.animated)}
            className={cn("group/tracker flex w-full items-stretch", className)}
            style={{ gap, height: blockHeight, ...style }}
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
                            // Hover motion only applies when the design-system
                            // `animated` axis is on — gated on the root's
                            // data-animated so animated={false} suppresses the
                            // scale/opacity jump entirely (not just its easing).
                            "group-data-[animated=true]/tracker:hover:scale-y-110",
                            "group-data-[animated=true]/tracker:hover:opacity-90",
                            "motion-reduce:hover:transform-none",
                        )}
                        style={{ backgroundColor: color }}
                    />
                )
            })}
        </div>
    )
}
