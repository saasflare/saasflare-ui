"use client"

import { useState } from "react"
import { Calendar } from "@saasflare/ui/calendar"

/** A single-date calendar grid with month navigation. */
export function Demo() {
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
        />
    )
}
