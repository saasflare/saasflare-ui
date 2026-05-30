"use client"

import { ScrollArea, ScrollBar } from "@saasflare/ui"

const integrations = ["Slack", "GitHub", "Linear", "Stripe", "Notion", "Figma", "Segment", "Datadog"]

/** A horizontally scrolling row of integration cards with a horizontal scrollbar. */
export function Demo() {
    return (
        <ScrollArea className="w-full max-w-sm whitespace-nowrap rounded-md border">
            <div className="flex w-max gap-3 p-4">
                {integrations.map((name) => (
                    <div
                        key={name}
                        className="flex size-24 shrink-0 items-center justify-center rounded-md border bg-muted text-sm font-medium"
                    >
                        {name}
                    </div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}
