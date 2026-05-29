"use client"

import { useState } from "react"
import { Label, Slider } from "@saasflare/ui"

/** A two-thumb slider expressing a price range. */
export function Demo() {
    const [range, setRange] = useState([20, 80])

    return (
        <div className="flex flex-col gap-3 w-full max-w-sm">
            <div className="flex items-center justify-between">
                <Label>Price range</Label>
                <span className="text-sm tabular-nums text-muted-foreground">
                    ${range[0]} – ${range[1]}
                </span>
            </div>
            <Slider value={range} onValueChange={setRange} max={100} step={5} />
        </div>
    )
}
