"use client"

import { useState } from "react"
import { Rating } from "@saasflare/ui"

/** An interactive star rating with controlled state. */
export function Demo() {
    const [score, setScore] = useState(0)

    return (
        <div className="flex flex-col gap-2">
            <Rating value={score} onChange={setScore} aria-label="Rate your experience" />
            <p className="text-sm text-muted-foreground">
                {score > 0 ? `You rated ${score} of 5` : "Tap a star to rate"}
            </p>
        </div>
    )
}
