"use client"

import { BarList } from "@saasflare/ui"

/** Per-row color overrides — useful for highlighting error or status tiers. */
export function Demo() {
    return (
        <div className="w-full max-w-md">
            <BarList
                valueFormatter={(n) => n.toLocaleString()}
                data={[
                    { name: "200 OK", value: 184200, color: "oklch(0.68 0.17 155)" },
                    { name: "301 Redirect", value: 42100, color: "oklch(0.65 0.18 230)" },
                    { name: "404 Not Found", value: 9800, color: "oklch(0.72 0.17 50)" },
                    { name: "500 Server Error", value: 1240, color: "oklch(0.62 0.21 25)" },
                ]}
            />
        </div>
    )
}
