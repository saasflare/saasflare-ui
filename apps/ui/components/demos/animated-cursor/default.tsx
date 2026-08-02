"use client"

import { AnimatedCursor } from "@saasflare/ui"

/**
 * A dot-and-ring cursor that follows the pointer. Normally mounted once in the
 * root layout; here it is scoped to the preview so it does not hijack the page.
 */
export function Demo() {
    return (
        <div className="border-border bg-muted/30 relative grid h-48 w-full max-w-lg place-items-center rounded-xl border">
            <p className="text-muted-foreground text-sm">Move your pointer across this area</p>
            <AnimatedCursor />
        </div>
    )
}
