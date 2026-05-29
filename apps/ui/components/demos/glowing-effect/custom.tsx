"use client"

import { GlowingEffect } from "@saasflare/ui"

/** Adjust the glow color, spread, and blur. */
export function Demo() {
    return (
        <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-fd-card p-8">
            <div className="relative w-full max-w-sm overflow-hidden rounded-xl border bg-background p-6">
                <GlowingEffect color="hsl(var(--chart-1))" spread={200} blur={30} />
                <h3 className="text-lg font-semibold">Edge-deployed by default</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Global low-latency delivery with zero config.
                </p>
            </div>
        </div>
    )
}
