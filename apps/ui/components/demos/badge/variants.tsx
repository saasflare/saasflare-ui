"use client"

import { Badge } from "@saasflare/ui"

/** The three visual treatments — solid, soft, and outline. */
export function Demo() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Badge variant="solid" intent="success">
                Solid
            </Badge>
            <Badge variant="soft" intent="success">
                Soft
            </Badge>
            <Badge variant="outline" intent="success">
                Outline
            </Badge>
        </div>
    )
}
