"use client"

import { Progress } from "@saasflare/ui"

const quotas = [
    { label: "API calls", used: 84200, limit: 100000 },
    { label: "Storage", used: 6.4, limit: 10, unit: "GB" },
    { label: "Team seats", used: 3, limit: 5, unit: "seats" },
]

/** Stacked plan-usage meters, a common billing-page pattern. */
export function Demo() {
    return (
        <div className="w-full max-w-md space-y-4">
            {quotas.map((q) => (
                <div key={q.label} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">{q.label}</span>
                        <span className="text-muted-foreground tabular-nums">
                            {q.used.toLocaleString()} / {q.limit.toLocaleString()}
                            {q.unit ? ` ${q.unit}` : ""}
                        </span>
                    </div>
                    <Progress value={(q.used / q.limit) * 100} />
                </div>
            ))}
        </div>
    )
}
