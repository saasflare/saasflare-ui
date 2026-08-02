"use client"

import { AnimatedShinyText } from "@saasflare/ui"

/** The announcement badge — a shimmer sweeping across pill-shaped text. */
export function Demo() {
    return (
        <div className="border-border bg-card inline-flex items-center rounded-full border px-4 py-1.5">
            <AnimatedShinyText>✨ Introducing team workspaces</AnimatedShinyText>
        </div>
    )
}
