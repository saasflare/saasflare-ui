"use client"

import { useRef } from "react"
import { AnimatedBeam } from "@saasflare/ui"

/** Two nodes joined by a pulsing beam — the integration-diagram primitive. */
export function Demo() {
    const containerRef = useRef<HTMLDivElement>(null)
    const fromRef = useRef<HTMLDivElement>(null)
    const toRef = useRef<HTMLDivElement>(null)

    return (
        <div
            ref={containerRef}
            className="relative flex w-full max-w-lg items-center justify-between px-6 py-16"
        >
            <div
                ref={fromRef}
                className="border-border bg-card z-10 grid size-14 place-items-center rounded-xl border text-sm font-medium shadow-sm"
            >
                App
            </div>
            <div
                ref={toRef}
                className="border-border bg-card z-10 grid size-14 place-items-center rounded-xl border text-sm font-medium shadow-sm"
            >
                API
            </div>
            <AnimatedBeam containerRef={containerRef} fromRef={fromRef} toRef={toRef} />
        </div>
    )
}
