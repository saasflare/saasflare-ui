"use client"

import { GradientText } from "@saasflare/ui"

/** Animated gradient fill applied inline to part of a headline. */
export function Demo() {
    return (
        <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-fd-card p-8">
            <h2 className="text-3xl font-bold tracking-tight">
                Build with <GradientText>Saasflare</GradientText>
            </h2>
        </div>
    )
}
