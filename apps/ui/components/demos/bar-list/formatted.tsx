"use client"

import { BarList } from "@saasflare/ui"

/** Revenue by plan, formatted as currency and capped to the top 4 rows. */
export function Demo() {
    return (
        <div className="w-full max-w-md">
            <BarList
                limit={4}
                valueFormatter={(n) => `$${n.toLocaleString()}`}
                data={[
                    { name: "Enterprise", value: 48200 },
                    { name: "Business", value: 31600 },
                    { name: "Pro", value: 19450 },
                    { name: "Starter", value: 8120 },
                    { name: "Free", value: 0 },
                ]}
            />
        </div>
    )
}
