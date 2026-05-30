"use client"

import { Button } from "@saasflare/ui"

/** Button visual treatments — the `variant` axis. */
export function Demo() {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <Button variant="solid">Solid</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="glass">Glass</Button>
        </div>
    )
}
