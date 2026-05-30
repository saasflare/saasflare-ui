"use client"

import { Separator } from "@saasflare/ui"

/** Horizontal and vertical separators dividing account metadata. */
export function Demo() {
    return (
        <div className="w-full max-w-sm">
            <div className="space-y-1">
                <h4 className="text-sm font-medium">Saasflare Analytics</h4>
                <p className="text-sm text-muted-foreground">Real-time product metrics for teams.</p>
            </div>
            <Separator className="my-4" />
            <div className="flex h-5 items-center gap-4 text-sm">
                <span>Docs</span>
                <Separator orientation="vertical" />
                <span>Changelog</span>
                <Separator orientation="vertical" />
                <span>Support</span>
            </div>
        </div>
    )
}
