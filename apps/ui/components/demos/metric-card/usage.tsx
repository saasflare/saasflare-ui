"use client"

import { MetricCard } from "@saasflare/ui"

/**
 * Usage metrics carry a denominator. `description` is the line that turns
 * "1,240" into something a customer can act on.
 */
export function Demo() {
    return (
        <div className="grid w-full gap-4 sm:grid-cols-3">
            <MetricCard label="Credits left" value="1,240" description="of 5,000 this cycle" />
            <MetricCard
                label="Seats used"
                value="7"
                description="of 10 — 3 invites pending"
                trend={{ value: 16.7, direction: "up" }}
            />
            <MetricCard label="Storage" value="18.2 GB" description="of 50 GB included" />
        </div>
    )
}
