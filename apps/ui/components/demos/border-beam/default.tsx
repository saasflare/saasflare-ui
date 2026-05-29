"use client"

import { BorderBeam } from "@saasflare/ui"

/** A glowing beam that orbits the border of a card. */
export function Demo() {
    return (
        <div className="relative h-64 w-full overflow-hidden rounded-lg border bg-fd-card p-8">
            <BorderBeam />
            <h3 className="text-lg font-semibold">Pro plan</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Unlimited projects, priority support, and advanced analytics.
            </p>
        </div>
    )
}
