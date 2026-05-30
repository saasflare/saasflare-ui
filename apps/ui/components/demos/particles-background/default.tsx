"use client"

import { ParticlesBackground } from "@saasflare/ui"

/** Ambient floating particles behind centered hero copy. */
export function Demo() {
    return (
        <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-lg border bg-fd-card p-8">
            <ParticlesBackground />
            <div className="relative z-10 text-center">
                <h2 className="text-2xl font-bold tracking-tight">Ship faster with Saasflare</h2>
                <p className="mt-2 text-sm text-muted-foreground">A calm, GPU-friendly backdrop.</p>
            </div>
        </div>
    )
}
