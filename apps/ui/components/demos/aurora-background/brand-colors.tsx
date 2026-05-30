"use client"

import { AuroraBackground } from "@saasflare/ui"

/** Opt into brand-rotating blob colors via the `colors` prop. */
export function Demo() {
    return (
        <AuroraBackground
            colors={["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]}
            className="flex h-64 w-full items-center justify-center rounded-lg border p-12 text-center"
        >
            <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Now in public beta
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">Built on your brand palette</h2>
            </div>
        </AuroraBackground>
    )
}
