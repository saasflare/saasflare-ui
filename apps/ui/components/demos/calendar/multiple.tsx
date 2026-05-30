"use client"

import { useState } from "react"
import { Calendar } from "@saasflare/ui/calendar"

/** Selecting several individual dates with mode="multiple". */
export function Demo() {
    const [dates, setDates] = useState<Date[] | undefined>([])

    return (
        <Calendar
            mode="multiple"
            selected={dates}
            onSelect={setDates}
            className="rounded-md border"
        />
    )
}
