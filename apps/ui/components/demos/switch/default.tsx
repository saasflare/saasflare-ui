"use client"

import { Label, Switch } from "@saasflare/ui"

/** A switch toggle paired with a label. */
export function Demo() {
    return (
        <div className="flex items-center gap-2">
            <Switch id="2fa" defaultChecked />
            <Label htmlFor="2fa">Require two-factor authentication</Label>
        </div>
    )
}
