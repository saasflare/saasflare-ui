"use client"

import { useState } from "react"
import { DateRangePicker, Label, type DateRange } from "@saasflare/ui"

/** A controlled date-range picker with a two-month calendar. */
export function Demo() {
    const [range, setRange] = useState<DateRange | undefined>()

    return (
        <div className="flex flex-col gap-2 w-full max-w-sm">
            <Label>Usage period</Label>
            <DateRangePicker value={range} onChange={setRange} />
        </div>
    )
}
