// @draft
"use client"

/**
 * @fileoverview Saasflare SparkChart — inline mini line/area/bar visualization.
 * @author Saasflare™
 *
 * Compact (~64×24 px by default) chart for tucking inside metric cards,
 * table cells, or KPI tiles. Pure SVG — no recharts dependency, no axes,
 * no tooltip overhead. For full charts use the `Chart` subpath
 * (`@saasflare/ui/chart`).
 *
 * @module packages/ui/components/ui/spark-chart
 * @package ui
 * @layer core
 *
 * @example
 * <SparkChart data={[3, 5, 4, 8, 6, 9, 11]} variant="area" />
 *
 * @example
 * <MetricCard
 *   title="MRR"
 *   value="$24,180"
 *   chart={<SparkChart data={mrrSeries} variant="line" />}
 * />
 */

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** Visual variant of the spark chart. */
export type SparkChartVariant = "line" | "area" | "bar"

/** Props for the SparkChart component. */
export interface SparkChartProps extends SaasflareComponentProps {
    /** Series of numeric points (length ≥ 2). */
    data: number[]
    /** Visual treatment. Default: `"area"`. */
    variant?: SparkChartVariant
    /** Stroke / fill color (any CSS color). Default: `var(--primary)`. */
    color?: string
    /** SVG width in pixels. Default: `64`. */
    width?: number
    /** SVG height in pixels. Default: `24`. */
    height?: number
    /** Line stroke width in pixels. Default: `1.5`. */
    strokeWidth?: number
    /** Additional class names. */
    className?: string
    /** Accessible label. */
    "aria-label"?: string
}

function buildPath(data: number[], width: number, height: number, sw: number) {
    const min = Math.min(...data)
    const max = Math.max(...data)
    const span = max - min || 1
    const innerW = width - sw
    const innerH = height - sw
    const offset = sw / 2

    return data
        .map((v, i) => {
            const x = offset + (i / (data.length - 1)) * innerW
            const y = offset + innerH - ((v - min) / span) * innerH
            return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`
        })
        .join(" ")
}

/**
 * Inline mini chart for KPI tiles, table cells, and metric cards.
 *
 * @component
 * @layer core
 */
export function SparkChart({
    data,
    variant = "area",
    color,
    width = 64,
    height = 24,
    strokeWidth = 1.5,
    className,
    surface,
    radius,
    animated,
    iconWeight,
    "aria-label": ariaLabel,
}: SparkChartProps) {
    const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

    const points = data.filter((v) => Number.isFinite(v))
    if (points.length < 2) return null

    const stroke = color ?? "var(--primary)"
    const linePath = buildPath(points, width, height, strokeWidth)
    const areaPath = `${linePath} L ${width - strokeWidth / 2} ${height - strokeWidth / 2} L ${strokeWidth / 2} ${height - strokeWidth / 2} Z`

    const min = Math.min(...points)
    const max = Math.max(...points)
    const span = max - min || 1
    const innerH = height - strokeWidth
    const offset = strokeWidth / 2
    // Proportional slot layout: each bar gets an equal slice of the width with a
    // ~30% gap. Scales to any point count (the old fixed-gap formula went
    // negative past ~40 points and the bars vanished).
    const slot = width / points.length
    const barW = Math.max(slot * 0.7, 0.5)

    return (
        <svg
            data-slot="spark-chart"
            data-variant={variant}
            data-surface={sf.surface}
            data-radius={sf.radius}
            data-animated={String(sf.animated)}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={ariaLabel ?? `Sparkline ${variant}`}
            className={cn("inline-block align-middle", className)}
        >
            {variant === "bar" ? (
                points.map((v, i) => {
                    const h = Math.max(((v - min) / span) * innerH, 1)
                    const x = i * slot + (slot - barW) / 2
                    const y = offset + innerH - h
                    return (
                        <rect
                            key={i}
                            data-slot="spark-chart-bar"
                            x={x}
                            y={y}
                            width={barW}
                            height={h}
                            fill={stroke}
                            rx={1}
                        />
                    )
                })
            ) : (
                <>
                    {variant === "area" && (
                        <path
                            data-slot="spark-chart-area"
                            d={areaPath}
                            fill={stroke}
                            fillOpacity={0.18}
                        />
                    )}
                    <path
                        data-slot="spark-chart-line"
                        d={linePath}
                        fill="none"
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </>
            )}
        </svg>
    )
}
