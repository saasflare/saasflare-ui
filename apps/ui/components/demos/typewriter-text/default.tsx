"use client"

import { TypewriterText } from "@saasflare/ui"

/** Reveals text word by word with a blinking cursor. */
export function Demo() {
    return (
        <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-fd-card p-8 text-center">
            <TypewriterText
                text="Hello, welcome to Saasflare."
                wordDelay={120}
                className="text-2xl font-bold"
            />
        </div>
    )
}
