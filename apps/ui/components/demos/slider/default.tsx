"use client"

import { Slider } from "@saasflare/ui"

/** A single-thumb slider for a percentage value. */
export function Demo() {
    return (
        <div className="w-full max-w-sm">
            <Slider defaultValue={[40]} max={100} step={1} />
        </div>
    )
}
