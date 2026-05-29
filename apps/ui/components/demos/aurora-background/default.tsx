"use client"

import { AuroraBackground } from "@saasflare/ui"

/** Soft multi-color aurora backdrop with centered hero copy. */
export function Demo() {
    return (
        <AuroraBackground className="flex h-64 w-full items-center justify-center rounded-lg border p-12 text-center">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Ship faster with Saasflare</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    The production-ready starter for your next SaaS.
                </p>
            </div>
        </AuroraBackground>
    )
}
