"use client"

import { AppIcon } from "@saasflare/ui"

/** AppIcon — the standalone SVG mark at several sizes. */
export function Demo() {
    return (
        <div className="flex flex-wrap items-end gap-6">
            <AppIcon size={24} />
            <AppIcon size={40} />
            <AppIcon size={64} />
        </div>
    )
}
