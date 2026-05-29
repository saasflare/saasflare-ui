"use client"

import { Input } from "@saasflare/ui"

/** A single text input for collecting an email address. */
export function Demo() {
    return (
        <div className="w-full max-w-sm">
            <Input type="email" placeholder="you@company.com" />
        </div>
    )
}
