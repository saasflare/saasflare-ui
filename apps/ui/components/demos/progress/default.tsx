"use client"

import { Progress } from "@saasflare/ui"

/** A single progress bar at a fixed value. */
export function Demo() {
    return (
        <div className="w-full max-w-md">
            <Progress value={68} />
        </div>
    )
}
