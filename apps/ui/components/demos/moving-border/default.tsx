"use client"

import { MovingBorder } from "@saasflare/ui"

/** A rotating gradient border wrapping a call-to-action button. */
export function Demo() {
    return (
        <MovingBorder>
            <button className="px-6 py-3 text-sm font-semibold">Upgrade to Pro</button>
        </MovingBorder>
    )
}
