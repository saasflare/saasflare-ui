"use client"

import { Input, Label } from "@saasflare/ui"

/** A label associated with an input via htmlFor. */
export function Demo() {
    return (
        <div className="flex flex-col gap-2 w-full max-w-sm">
            <Label htmlFor="api-key">API key name</Label>
            <Input id="api-key" placeholder="Production server" />
        </div>
    )
}
