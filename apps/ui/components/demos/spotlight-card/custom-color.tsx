"use client"

import { SpotlightCard } from "@saasflare/ui"

/** A spotlight card with a custom highlight color and larger radius. */
export function Demo() {
    return (
        <SpotlightCard
            className="w-full max-w-sm"
            spotlightColor="var(--chart-1)"
            spotlightSize={320}
        >
            <h3 className="text-base font-semibold">Usage-based pricing</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Only pay for what you ship. Scale from zero to millions of requests
                without renegotiating a contract.
            </p>
        </SpotlightCard>
    )
}
