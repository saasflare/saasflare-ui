"use client"

import { useState } from "react"
import { Checkbox, Label } from "@saasflare/ui"

/** A controlled checkbox driving local state. */
export function Demo() {
    const [checked, setChecked] = useState(true)

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Checkbox
                    id="auto-deploy"
                    checked={checked}
                    onCheckedChange={(value) => setChecked(value === true)}
                />
                <Label htmlFor="auto-deploy">Auto-deploy on push to main</Label>
            </div>
            <p className="text-sm text-muted-foreground">
                {checked ? "Deploys run automatically." : "Deploys are manual."}
            </p>
        </div>
    )
}
