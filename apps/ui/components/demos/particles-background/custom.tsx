"use client"

import { ParticlesBackground } from "@saasflare/ui"

/** Denser particles with a custom color and larger max size. */
export function Demo() {
    return (
        <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-lg border bg-fd-card p-8">
            <ParticlesBackground count={30} color="hsl(var(--chart-2))" maxSize={6} />
            <div className="relative z-10 text-center">
                <h2 className="text-2xl font-bold tracking-tight">Tune the density</h2>
            </div>
        </div>
    )
}
