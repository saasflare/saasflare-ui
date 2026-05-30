"use client"

import { useState } from "react"
import { Label, Slider } from "@saasflare/ui"

/** A controlled slider that displays its current value. */
export function Demo() {
    const [value, setValue] = useState([8])

    return (
        <div className="flex flex-col gap-3 w-full max-w-sm">
            <div className="flex items-center justify-between">
                <Label>Concurrent builds</Label>
                <span className="text-sm tabular-nums text-muted-foreground">{value[0]}</span>
            </div>
            <Slider value={value} onValueChange={setValue} min={1} max={16} step={1} />
        </div>
    )
}
