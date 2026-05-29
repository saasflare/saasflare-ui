"use client"

import { Tracker } from "@saasflare/ui"

/** A healthy service — all blocks operational, with a taller block height. */
export function Demo() {
    const data = Array.from({ length: 24 }, (_, i) => ({
        color: "emerald",
        tooltip: `${String(i).padStart(2, "0")}:00 — 100% uptime`,
    }))

    return (
        <div className="w-full max-w-md">
            <Tracker data={data} blockHeight={40} gap={3} />
        </div>
    )
}
