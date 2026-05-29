"use client"

import { Spinner } from "@saasflare/ui"

/** The spinner at increasing sizes, set via the `size-*` utility. */
export function Demo() {
    return (
        <div className="flex items-center gap-6 text-muted-foreground">
            <Spinner className="size-4" />
            <Spinner className="size-6" />
            <Spinner className="size-8" />
            <Spinner className="size-10" />
        </div>
    )
}
