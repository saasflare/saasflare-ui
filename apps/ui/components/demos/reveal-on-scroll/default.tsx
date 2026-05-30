"use client"

import { RevealOnScroll } from "@saasflare/ui"

/** Content fades and slides up when scrolled into view. */
export function Demo() {
    return (
        <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-fd-card p-8">
            <RevealOnScroll>
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight">Ship faster with Saasflare</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Reveals as it enters the viewport.
                    </p>
                </div>
            </RevealOnScroll>
        </div>
    )
}
