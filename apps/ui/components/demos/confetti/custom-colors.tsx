"use client"

import { useState } from "react"
import { Button, Confetti } from "@saasflare/ui"

/** Customize particle count and colors. */
export function Demo() {
    const [active, setActive] = useState(false)

    return (
        <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-fd-card p-8">
            <Button variant="soft" onClick={() => setActive(true)}>
                Upgrade complete
            </Button>
            <Confetti
                active={active}
                count={60}
                colors={["#ff6b6b", "#ffd93d", "#6bcb77"]}
                onComplete={() => setActive(false)}
            />
        </div>
    )
}
