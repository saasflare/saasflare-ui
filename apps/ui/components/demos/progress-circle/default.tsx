"use client"

import { ProgressCircle } from "@saasflare/ui"

/** A circular progress ring with a centered percentage label. */
export function Demo() {
    return (
        <ProgressCircle value={72} size="lg">
            <span className="text-lg font-semibold tabular-nums">72%</span>
        </ProgressCircle>
    )
}
