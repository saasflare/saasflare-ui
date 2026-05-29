"use client"

import { useState } from "react"
import { DatePicker, Label } from "@saasflare/ui"

/** A date picker restricted to a minimum date. */
export function Demo() {
    const [date, setDate] = useState<Date | undefined>()

    return (
        <div className="flex flex-col gap-2 w-full max-w-sm">
            <Label>Schedule report</Label>
            <DatePicker
                value={date}
                onChange={setDate}
                minDate={new Date()}
                placeholder="Pick a future date"
            />
        </div>
    )
}
