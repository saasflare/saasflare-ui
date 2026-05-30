"use client"

import { Callout, WarningIcon } from "@saasflare/ui"

/** An inline emphasized message box with a title and leading icon. */
export function Demo() {
    return (
        <Callout intent="warning" title="Heads up" icon={<WarningIcon />} className="max-w-md">
            Rotating your API key invalidates all existing tokens immediately. Update your
            integrations before continuing.
        </Callout>
    )
}
