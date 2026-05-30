"use client"

import { Countdown } from "@saasflare/ui"

/** The presentational component on its own, with fixed values (no ticking). */
export function Demo() {
    return <Countdown days={3} hours={14} minutes={8} seconds={52} />
}
