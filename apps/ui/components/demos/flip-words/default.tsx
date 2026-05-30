"use client"

import { FlipWords } from "@saasflare/ui"

/** Inline rotating words inside a headline. */
export function Demo() {
    return (
        <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-fd-card p-8">
            <h2 className="text-2xl font-bold tracking-tight">
                Build <FlipWords words={["websites", "apps", "products"]} /> faster
            </h2>
        </div>
    )
}
