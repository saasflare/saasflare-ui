"use client"

import { ThemeModeToggle } from "@saasflare/ui"

/** Light/dark toggle — icon-only and labelled (`showText`) variants. */
export function Demo() {
    return (
        <div className="flex flex-wrap items-center gap-4">
            <ThemeModeToggle />
            <ThemeModeToggle showText />
        </div>
    )
}
