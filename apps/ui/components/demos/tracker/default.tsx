"use client"

import { Tracker } from "@saasflare/ui"

/** A 30-day uptime tracker — one block per day, colored by status. */
export function Demo() {
    const data = Array.from({ length: 30 }, (_, i) => {
        const day = i + 1
        if (day === 12) return { color: "red", tooltip: `Day ${day} — Major outage (47m)` }
        if (day === 23 || day === 24) return { color: "amber", tooltip: `Day ${day} — Degraded latency` }
        return { color: "emerald", tooltip: `Day ${day} — Operational` }
    })

    return (
        <div className="w-full max-w-md">
            <Tracker data={data} />
        </div>
    )
}
