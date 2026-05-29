"use client"

import { BorderBeam } from "@saasflare/ui"

/** Tune the beam color, length, and orbit speed. */
export function Demo() {
    return (
        <div className="relative h-64 w-full overflow-hidden rounded-lg border bg-fd-card p-8">
            <BorderBeam color="hsl(var(--chart-1))" duration={8} size={200} />
            <h3 className="text-lg font-semibold">Enterprise</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                SSO, audit logs, and a dedicated success manager.
            </p>
        </div>
    )
}
