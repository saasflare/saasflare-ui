"use client"

import { useState } from "react"
import { Button, Confetti } from "@saasflare/ui"

/** Fire a confetti burst on click; resets via `onComplete`. */
export function Demo() {
    const [active, setActive] = useState(false)

    return (
        <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-fd-card p-8">
            <Button onClick={() => setActive(true)}>Celebrate the launch</Button>
            <Confetti active={active} onComplete={() => setActive(false)} />
        </div>
    )
}
