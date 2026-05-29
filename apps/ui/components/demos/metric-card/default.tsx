"use client"

import { MetricCard } from "@saasflare/ui"

/** A dashboard KPI card with a trend indicator. */
export function Demo() {
    return (
        <MetricCard
            className="w-full max-w-sm"
            label="Monthly Recurring Revenue"
            value="$48,200"
            trend={{ value: 8.2, direction: "up" }}
        />
    )
}
