"use client"

import { Checkbox, Label } from "@saasflare/ui"

/** Default, checked, and disabled checkbox states. */
export function Demo() {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <Checkbox id="newsletter" />
                <Label htmlFor="newsletter">Product newsletter</Label>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox id="security" defaultChecked />
                <Label htmlFor="security">Security alerts</Label>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox id="beta" disabled />
                <Label htmlFor="beta">Beta features (unavailable on Free)</Label>
            </div>
        </div>
    )
}
