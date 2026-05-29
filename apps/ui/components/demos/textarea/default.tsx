"use client"

import { Textarea } from "@saasflare/ui"

/** A multi-line text input for longer free-form content. */
export function Demo() {
    return (
        <div className="w-full max-w-sm">
            <Textarea placeholder="What changed in this release?" rows={4} />
        </div>
    )
}
