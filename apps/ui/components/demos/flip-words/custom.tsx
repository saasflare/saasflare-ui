"use client"

import { FlipWords } from "@saasflare/ui"

/** Tune the cycle interval and color of the rotating words. */
export function Demo() {
    return (
        <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-fd-card p-8">
            <h2 className="text-2xl font-bold tracking-tight">
                Software that is{" "}
                <FlipWords
                    words={["scalable", "reliable", "beautiful"]}
                    interval={2000}
                    className="text-primary"
                />
            </h2>
        </div>
    )
}
