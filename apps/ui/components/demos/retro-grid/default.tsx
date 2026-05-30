"use client"

import { RetroGrid } from "@saasflare/ui"

/** Perspective grid backdrop with centered hero copy. */
export function Demo() {
    return (
        <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-lg border bg-fd-card p-8">
            <RetroGrid />
            <div className="relative z-10 text-center">
                <h2 className="text-2xl font-bold tracking-tight">The future of shipping SaaS</h2>
                <p className="mt-2 text-sm text-muted-foreground">From idea to production in days.</p>
            </div>
        </div>
    )
}
