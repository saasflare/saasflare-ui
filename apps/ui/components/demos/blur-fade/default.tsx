"use client"

import { BlurFade } from "@saasflare/ui"

/** Content fades in with a blur as it enters the viewport. */
export function Demo() {
    return (
        <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-fd-card p-8">
            <BlurFade>
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight">Ship faster with Saasflare</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Everything you need to launch, already wired up.
                    </p>
                </div>
            </BlurFade>
        </div>
    )
}
