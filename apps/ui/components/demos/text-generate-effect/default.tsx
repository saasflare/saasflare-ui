"use client"

import { TextGenerateEffect } from "@saasflare/ui"

/** Text reveals word by word as it enters view. */
export function Demo() {
    return (
        <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-fd-card p-8 text-center">
            <TextGenerateEffect text="Build your SaaS in record time" className="text-2xl font-bold" />
        </div>
    )
}
