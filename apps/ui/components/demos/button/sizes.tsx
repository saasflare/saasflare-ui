"use client"

import { Button } from "@saasflare/ui"

/** The `size` axis, from `xs` to `xl`. */
export function Demo() {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra large</Button>
        </div>
    )
}
