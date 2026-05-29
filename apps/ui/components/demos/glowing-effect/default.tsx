"use client"

import { GlowingEffect } from "@saasflare/ui"

/** A border glow that follows the cursor. Hover the card. */
export function Demo() {
    return (
        <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-fd-card p-8">
            <div className="relative w-full max-w-sm overflow-hidden rounded-xl border bg-background p-6">
                <GlowingEffect />
                <h3 className="text-lg font-semibold">Realtime analytics</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Track activation, retention, and revenue in one place.
                </p>
            </div>
        </div>
    )
}
