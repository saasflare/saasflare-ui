"use client"

import { StickyScrollReveal } from "@saasflare/ui"

const items = [
    {
        title: "Connect your data",
        description: "Plug in Postgres, Stripe, and your auth provider in minutes.",
        content: (
            <div className="flex h-40 items-center justify-center text-sm font-medium text-muted-foreground">
                Step 1 — Connect
            </div>
        ),
    },
    {
        title: "Configure your pipeline",
        description: "Map events to dashboards with a type-safe schema.",
        content: (
            <div className="flex h-40 items-center justify-center text-sm font-medium text-muted-foreground">
                Step 2 — Configure
            </div>
        ),
    },
    {
        title: "Ship to production",
        description: "Deploy to the edge with one command and watch it scale.",
        content: (
            <div className="flex h-40 items-center justify-center text-sm font-medium text-muted-foreground">
                Step 3 — Ship
            </div>
        ),
    },
]

/** Split layout: left text stays sticky while right content scrolls. */
export function Demo() {
    return (
        <div className="w-full rounded-lg border bg-fd-card p-8">
            <StickyScrollReveal items={items} />
        </div>
    )
}
