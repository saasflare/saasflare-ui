"use client"

import { useState } from "react"
import { Label, Switch } from "@saasflare/ui"

/** A controlled switch reflecting its on/off state. */
export function Demo() {
    const [enabled, setEnabled] = useState(false)

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Switch id="maintenance" checked={enabled} onCheckedChange={setEnabled} />
                <Label htmlFor="maintenance">Maintenance mode</Label>
            </div>
            <p className="text-sm text-muted-foreground">
                {enabled ? "Site is offline for visitors." : "Site is live."}
            </p>
        </div>
    )
}
