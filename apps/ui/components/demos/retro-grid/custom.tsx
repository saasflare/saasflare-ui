"use client"

import { RetroGrid } from "@saasflare/ui"

/** Recolor the grid and tighten the cell size and tilt. */
export function Demo() {
    return (
        <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-lg border bg-fd-card p-8">
            <RetroGrid gridColor="hsl(var(--primary))" gridSize={40} angle={70} />
            <div className="relative z-10 text-center">
                <h2 className="text-2xl font-bold tracking-tight">Branded backdrop</h2>
            </div>
        </div>
    )
}
