"use client"

import { Kbd, KbdGroup } from "@saasflare/ui"

/** Keyboard shortcut keys, single and grouped. */
export function Demo() {
    return (
        <div className="flex flex-col gap-4">
            <Kbd>Esc</Kbd>
            <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
            </KbdGroup>
            <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>Shift</Kbd>
                <Kbd>P</Kbd>
            </KbdGroup>
        </div>
    )
}
