"use client"

import { AspectRatio } from "@saasflare/ui"

/** A 1:1 square frame, ideal for avatars or logo tiles. */
export function Demo() {
    return (
        <div className="w-full max-w-sm">
            <AspectRatio
                ratio={1}
                className="flex items-center justify-center rounded-md border bg-muted"
            >
                <span className="text-2xl font-semibold tracking-tight">SF</span>
            </AspectRatio>
        </div>
    )
}
