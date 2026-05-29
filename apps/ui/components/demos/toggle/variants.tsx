"use client"

import { Toggle } from "@saasflare/ui"

/** The default and outline toggle treatments across sizes. */
export function Demo() {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <Toggle variant="default" defaultPressed>
                Default
            </Toggle>
            <Toggle variant="outline">Outline</Toggle>
            <Toggle variant="outline" size="sm">
                Small
            </Toggle>
            <Toggle variant="outline" size="lg">
                Large
            </Toggle>
        </div>
    )
}
