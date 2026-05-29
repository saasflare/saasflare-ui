"use client"

import { useMemo } from "react"
import { Countdown, useCountdown } from "@saasflare/ui"

/** A compact countdown with unit labels hidden — fits a promo banner. */
export function Demo() {
    const target = useMemo(() => Date.now() + 1000 * 60 * 60 * 26 + 1000 * 60 * 42, [])
    const { days, hours, minutes, seconds } = useCountdown(target)

    return (
        <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">Early-bird pricing ends in</p>
            <Countdown
                days={days}
                hours={hours}
                minutes={minutes}
                seconds={seconds}
                showLabels={false}
            />
        </div>
    )
}
