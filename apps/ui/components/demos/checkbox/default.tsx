"use client"

import { Checkbox, Label } from "@saasflare/ui"

/** A checkbox paired with a clickable label. */
export function Demo() {
    return (
        <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">I agree to the terms of service</Label>
        </div>
    )
}
