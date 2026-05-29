"use client"

import { SpotlightCard } from "@saasflare/ui"

/** A card with a spotlight gradient that follows the cursor. Hover to see it. */
export function Demo() {
    return (
        <SpotlightCard className="w-full max-w-sm">
            <h3 className="text-base font-semibold">Edge network</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Serve every request from the location closest to your users — no config
                required. Move your mouse across this card to see the spotlight.
            </p>
        </SpotlightCard>
    )
}
