"use client"

import { MouseGradientBlob } from "@saasflare/ui"

/** Ambient gradient blob that tracks the cursor. Move your mouse over the panel. */
export function Demo() {
    return (
        <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-lg border bg-fd-card p-8">
            <MouseGradientBlob />
            <div className="relative z-10 text-center">
                <h2 className="text-2xl font-bold tracking-tight">Ship faster with Saasflare</h2>
                <p className="mt-2 text-sm text-muted-foreground">Move your cursor across the panel.</p>
            </div>
        </div>
    )
}
