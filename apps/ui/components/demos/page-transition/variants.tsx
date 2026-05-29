"use client"

import { useState } from "react"
import { Button, PageTransition } from "@saasflare/ui"

const variants = ["fade", "slideUp", "slideDown", "scale"] as const

/** The four built-in transition presets. */
export function Demo() {
    const [variant, setVariant] = useState<(typeof variants)[number]>("slideUp")

    return (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-6 rounded-lg border bg-fd-card p-8">
            <PageTransition variant={variant} duration={0.4} transitionKey={variant}>
                <div className="rounded-lg border bg-background px-8 py-6 text-center">
                    <p className="text-sm text-muted-foreground">Variant</p>
                    <p className="text-xl font-semibold">{variant}</p>
                </div>
            </PageTransition>
            <div className="flex flex-wrap justify-center gap-2">
                {variants.map((v) => (
                    <Button
                        key={v}
                        size="sm"
                        variant={v === variant ? "solid" : "outline"}
                        onClick={() => setVariant(v)}
                    >
                        {v}
                    </Button>
                ))}
            </div>
        </div>
    )
}
