"use client"

import { Skeleton } from "@saasflare/ui"

/** A loading placeholder shaped like a media card with avatar and text lines. */
export function Demo() {
    return (
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-lg border p-4">
            <Skeleton as="card" className="h-40 w-full" />
            <div className="flex items-center gap-3">
                <Skeleton as="avatar" className="size-10" />
                <div className="flex flex-1 flex-col gap-2">
                    <Skeleton as="text" className="h-4 w-3/4" />
                    <Skeleton as="text" className="h-3 w-1/2" />
                </div>
            </div>
        </div>
    )
}
