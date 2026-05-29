"use client"

import { useState } from "react"
import { MoonIcon, Toggle } from "@saasflare/ui"

/** A two-state toggle button controlling a single setting. */
export function Demo() {
    const [pressed, setPressed] = useState(false)

    return (
        <Toggle
            pressed={pressed}
            onPressedChange={setPressed}
            aria-label="Toggle dark mode"
        >
            <MoonIcon className="size-4" />
            Dark mode
        </Toggle>
    )
}
