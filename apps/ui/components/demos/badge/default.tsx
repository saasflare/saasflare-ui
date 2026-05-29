"use client"

import { Badge } from "@saasflare/ui"

/** Status badges across the six semantic intents. */
export function Demo() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Badge intent="primary">New</Badge>
            <Badge intent="success">Active</Badge>
            <Badge intent="warning">Trial ending</Badge>
            <Badge intent="danger">Past due</Badge>
            <Badge intent="info">Beta</Badge>
            <Badge intent="neutral">Archived</Badge>
        </div>
    )
}
