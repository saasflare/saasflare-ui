"use client"

import { useState } from "react"
import { DateRangePicker, Label, type DateRange } from "@saasflare/ui"

/** A single-month range picker bounded to dates up to today. */
export function Demo() {
    const [range, setRange] = useState<DateRange | undefined>()

    return (
        <div className="flex flex-col gap-2 w-full max-w-sm">
            <Label>Reporting window</Label>
            <DateRangePicker
                value={range}
                onChange={setRange}
                maxDate={new Date()}
                numberOfMonths={1}
            />
        </div>
    )
}
