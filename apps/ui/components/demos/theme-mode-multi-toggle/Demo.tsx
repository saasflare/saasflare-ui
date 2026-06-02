"use client"

import { ThemeModeMultiToggle } from "@saasflare/ui"

/**
 * The three `appearance` variants side by side. Each toggle wires into
 * `next-themes` via the docs ThemeProvider, so clicking a segment switches
 * the whole page between light, dark, and system.
 */
export function Demo() {
    return (
        <div className="flex flex-wrap items-center gap-6">
            <ThemeModeMultiToggle appearance="icon" />
            <ThemeModeMultiToggle appearance="icon-inherit" radius="sharp" />
            <ThemeModeMultiToggle appearance="button" radius="rounded" />
        </div>
    )
}
