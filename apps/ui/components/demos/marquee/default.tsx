"use client"

import { Marquee } from "@saasflare/ui"

const logos = ["Acme", "Globex", "Initech", "Umbrella", "Hooli", "Stark"]

/** Infinite logo ticker that pauses on hover. */
export function Demo() {
    return (
        <div className="flex h-64 w-full items-center rounded-lg border bg-fd-card">
            <Marquee className="w-full">
                {logos.map((name) => (
                    <div
                        key={name}
                        className="flex h-12 items-center rounded-md border bg-background px-6 text-sm font-semibold text-muted-foreground"
                    >
                        {name}
                    </div>
                ))}
            </Marquee>
        </div>
    )
}
