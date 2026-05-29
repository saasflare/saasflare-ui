"use client"

import { Button } from "@saasflare/ui"

/** Semantic color intents, applied across any variant. */
export function Demo() {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <Button intent="primary">Primary</Button>
            <Button intent="neutral">Neutral</Button>
            <Button intent="success">Success</Button>
            <Button intent="warning">Warning</Button>
            <Button intent="danger">Danger</Button>
            <Button intent="info">Info</Button>
        </div>
    )
}
