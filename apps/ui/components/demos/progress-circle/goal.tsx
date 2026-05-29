"use client"

import { ProgressCircle } from "@saasflare/ui"

/** A goal tracker with a custom max — quarterly revenue against target. */
export function Demo() {
    const booked = 84
    const target = 120

    return (
        <ProgressCircle value={booked} max={target} size="xl">
            <div className="text-center">
                <span className="block text-xl font-bold tabular-nums">${booked}k</span>
                <span className="text-xs text-muted-foreground">of ${target}k</span>
            </div>
        </ProgressCircle>
    )
}
