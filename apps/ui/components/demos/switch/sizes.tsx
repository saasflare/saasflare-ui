"use client"

import { Label, Switch } from "@saasflare/ui"

/** The small and default switch sizes. */
export function Demo() {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <Switch id="compact-sm" size="sm" defaultChecked />
                <Label htmlFor="compact-sm">Compact density (sm)</Label>
            </div>
            <div className="flex items-center gap-2">
                <Switch id="compact-default" size="md" defaultChecked />
                <Label htmlFor="compact-default">Comfortable density (default)</Label>
            </div>
        </div>
    )
}
