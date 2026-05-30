"use client"

import { useMemo } from "react"
import { Countdown, useCountdown } from "@saasflare/ui"

/** A live countdown to a launch date, driven by the `useCountdown` hook. */
export function Demo() {
    const target = useMemo(() => Date.now() + 1000 * 60 * 60 * 24 * 9 + 1000 * 60 * 60 * 5, [])
    const { days, hours, minutes, seconds } = useCountdown(target)

    return <Countdown days={days} hours={hours} minutes={minutes} seconds={seconds} />
}
