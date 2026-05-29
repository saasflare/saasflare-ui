"use client"

import { ShimmerButton } from "@saasflare/ui"

/** Tune the shimmer color, background, and cycle speed. */
export function Demo() {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <ShimmerButton shimmerColor="rgba(255,255,255,0.35)" speed={2}>
                Launch Your SaaS
            </ShimmerButton>
            <ShimmerButton background="#18181b" shimmerColor="rgba(255,255,255,0.25)" speed={3.5}>
                Start 14-day trial
            </ShimmerButton>
        </div>
    )
}
