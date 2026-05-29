"use client"

import { MetricCard } from "@saasflare/ui"

const METRICS = [
    { label: "Active Users", value: "12,840", trend: { value: 12.5, direction: "up" } as const },
    { label: "Churn Rate", value: "2.1%", trend: { value: 0.4, direction: "down" } as const },
    { label: "Avg. Session", value: "8m 12s", trend: { value: 0, direction: "flat" } as const },
]

/** A row of KPI cards covering up, down, and flat trends. */
export function Demo() {
    return (
        <div className="grid w-full gap-4 sm:grid-cols-3">
            {METRICS.map((metric) => (
                <MetricCard
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    trend={metric.trend}
                />
            ))}
        </div>
    )
}
