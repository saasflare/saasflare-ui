// @toreview
"use client"

/**
 * @fileoverview Saasflare MetricCard — dashboard KPI display.
 * @module packages/core/components/ui/metric-card
 * @layer core
 *
 * Displays a single metric with label, value, trend indicator, and optional icon.
 * Used in dashboard overviews, analytics panels, and summary sections.
 *
 * @example
 * import { MetricCard } from "@saasflare/ui";
 * import { UsersIcon } from "./phosphor";
 *
 * <MetricCard
 *   label="Active Users"
 *   value="1,234"
 *   trend={{ value: 12.5, direction: "up" }}
 *   icon={<UsersIcon />}
 * />
 */

import * as React from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** Trend indicator data */
interface MetricTrend {
  /** Numeric change (displayed as percentage) */
  value: number
  /** Direction of the trend */
  direction: "up" | "down" | "flat"
}

/** Props for the MetricCard component */
interface MetricCardProps extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>, SaasflareComponentProps {
  /** Metric label (e.g. "Revenue", "Active Users") */
  label: string
  /** Formatted metric value (e.g. "$12,345", "1,234") */
  value: string
  /** Optional trend indicator */
  trend?: MetricTrend
  /** Optional icon element */
  icon?: React.ReactNode
}

const TREND_STYLES = {
  up: "text-success",
  down: "text-destructive",
  flat: "text-muted-foreground",
} as const

const TREND_ARROWS = {
  up: "\u2191",
  down: "\u2193",
  flat: "\u2192",
} as const

/**
 * Dashboard metric card displaying a KPI with trend.
 *
 * @component
 * @layer core
 *
 * @param {string} label - Metric label
 * @param {string} value - Formatted metric value
 * @param {MetricTrend} trend - Optional trend with value and direction
 * @param {React.ReactNode} icon - Optional icon
 *
 * @example
 * <MetricCard
 *   label="Monthly Revenue"
 *   value="$48,200"
 *   trend={{ value: 8.2, direction: "up" }}
 * />
 */
function MetricCard({
  label,
  value,
  trend,
  icon,
  className,
  surface,
  radius,
  animated,
  ...props
}: MetricCardProps) {
  const sf = useSaasflareProps({ surface, radius, animated })

  return (
    <div
      {...props}
      data-slot="metric-card"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "flex flex-col gap-2 rounded-xl border bg-card p-6 text-card-foreground shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {icon && (
          <span className="text-muted-foreground [&_svg]:size-4">{icon}</span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        {trend && (
          <span className={cn("text-xs font-medium", TREND_STYLES[trend.direction])}>
            {TREND_ARROWS[trend.direction]} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  )
}

export { MetricCard, type MetricCardProps, type MetricTrend }
