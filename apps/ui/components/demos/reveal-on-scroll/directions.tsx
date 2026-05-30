"use client"

import { RevealOnScroll } from "@saasflare/ui"

/** Slide in from any direction with an optional delay. */
export function Demo() {
    return (
        <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-fd-card p-8">
            <div className="space-y-3">
                <RevealOnScroll direction="left">
                    <p className="rounded-md border bg-background px-4 py-2 text-sm">Slides from the left</p>
                </RevealOnScroll>
                <RevealOnScroll direction="right" delay={0.15}>
                    <p className="rounded-md border bg-background px-4 py-2 text-sm">Slides from the right</p>
                </RevealOnScroll>
                <RevealOnScroll direction="up" delay={0.3}>
                    <p className="rounded-md border bg-background px-4 py-2 text-sm">Slides up</p>
                </RevealOnScroll>
            </div>
        </div>
    )
}
