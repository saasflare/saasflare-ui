"use client"

import { MovingBorder } from "@saasflare/ui"

/** Wrap any content — here a pricing highlight card — in an animated border. */
export function Demo() {
    return (
        <MovingBorder
            colors={["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--primary))"]}
            duration={4}
            borderWidth={2}
            className="w-full max-w-sm"
        >
            <div className="p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Most popular
                </p>
                <p className="mt-2 text-2xl font-semibold">Scale — $99/mo</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    Unlimited projects, SSO, and priority support for growing teams.
                </p>
            </div>
        </MovingBorder>
    )
}
