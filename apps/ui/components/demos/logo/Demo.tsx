"use client"

import { Logo } from "@saasflare/ui"

/** Logo — icon-only mark plus the wordmark across size presets. */
export function Demo() {
    return (
        <div className="flex flex-wrap items-end gap-8">
            <Logo size="icon" interactive={false} />
            <Logo size="sm" interactive={false} />
            <Logo size="md" interactive={false} />
            <Logo size="lg" interactive={false} />
        </div>
    )
}
