"use client"

import { TextGenerateEffect } from "@saasflare/ui"

/** Slower stagger rendered as an `h1`. */
export function Demo() {
    return (
        <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-fd-card p-8 text-center">
            <TextGenerateEffect
                text="Ship faster. Scale better. Sleep more."
                stagger={0.08}
                as="h1"
                className="text-3xl font-bold tracking-tight"
            />
        </div>
    )
}
