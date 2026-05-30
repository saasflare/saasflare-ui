"use client"

import { useState } from "react"
import { Label, NumberInput } from "@saasflare/ui"

/** Disabled input and a variant with the steppers hidden. */
export function Demo() {
    const [rate, setRate] = useState(2)

    return (
        <div className="flex flex-col gap-4 w-full max-w-[14rem]">
            <div className="flex flex-col gap-2">
                <Label>Included seats (disabled)</Label>
                <NumberInput value={5} disabled />
            </div>
            <div className="flex flex-col gap-2">
                <Label>Rate limit (no steppers)</Label>
                <NumberInput value={rate} onChange={setRate} min={1} hideSteppers />
            </div>
        </div>
    )
}
