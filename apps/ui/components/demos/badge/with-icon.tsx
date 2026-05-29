"use client"

import { Badge, CheckCircleIcon, WarningIcon } from "@saasflare/ui"

/** Badges with a leading status icon. */
export function Demo() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Badge variant="soft" intent="success">
                <CheckCircleIcon />
                Deployed
            </Badge>
            <Badge variant="soft" intent="warning">
                <WarningIcon />
                Degraded
            </Badge>
        </div>
    )
}
