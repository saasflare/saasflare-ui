"use client"

import { GradientText } from "@saasflare/ui"

/** Supply custom color stops and a faster animation speed. */
export function Demo() {
    return (
        <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-fd-card p-8">
            <GradientText
                colors={["#ff6b6b", "#ffd93d", "#6bcb77"]}
                speed={4}
                className="text-3xl font-bold tracking-tight"
            >
                Ship your next big idea
            </GradientText>
        </div>
    )
}
