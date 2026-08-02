"use client"

import { AnimatedCounter } from "@saasflare/ui"

/** Metrics that count up the first time they scroll into view. */
export function Demo() {
    return (
        <div className="grid w-full max-w-lg grid-cols-3 gap-8 text-center">
            <div>
                <AnimatedCounter value={12480} className="text-3xl font-bold tracking-tight" />
                <p className="text-muted-foreground mt-1 text-sm">Active users</p>
            </div>
            <div>
                <AnimatedCounter
                    value={2.4}
                    decimals={1}
                    prefix="$"
                    suffix="M"
                    className="text-3xl font-bold tracking-tight"
                />
                <p className="text-muted-foreground mt-1 text-sm">ARR</p>
            </div>
            <div>
                <AnimatedCounter
                    value={99.9}
                    decimals={1}
                    suffix="%"
                    className="text-3xl font-bold tracking-tight"
                />
                <p className="text-muted-foreground mt-1 text-sm">Uptime</p>
            </div>
        </div>
    )
}
