"use client"

import { useState } from "react"
import { DatePicker, Label } from "@saasflare/ui"

/** A controlled single-date picker in a popover. */
export function Demo() {
    const [date, setDate] = useState<Date | undefined>()

    return (
        <div className="flex flex-col gap-2 w-full max-w-sm">
            <Label>Trial ends on</Label>
            <DatePicker value={date} onChange={setDate} />
        </div>
    )
}
