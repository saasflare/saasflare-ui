"use client"

import { useState } from "react"
import { Label, NumberInput } from "@saasflare/ui"

/** A numeric input with stepper buttons and min/max clamping. */
export function Demo() {
    const [seats, setSeats] = useState(3)

    return (
        <div className="flex flex-col gap-2 w-full max-w-[12rem]">
            <Label>Team seats</Label>
            <NumberInput value={seats} onChange={setSeats} min={1} max={20} step={1} />
        </div>
    )
}
