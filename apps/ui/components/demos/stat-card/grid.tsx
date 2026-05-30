"use client"

import { StatCard } from "@saasflare/ui"

const STATS = [
    { value: "10K+", label: "Active teams" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "$2.4M", label: "Revenue tracked" },
    { value: "4.9/5", label: "Average rating" },
]

/** A stats strip for a marketing landing page. */
export function Demo() {
    return (
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
                <StatCard key={stat.label} value={stat.value} label={stat.label} />
            ))}
        </div>
    )
}
