"use client"

import { Input, Label } from "@saasflare/ui"

/** An input paired with a Label, wired up via htmlFor / id. */
export function Demo() {
    return (
        <div className="flex flex-col gap-2 w-full max-w-sm">
            <Label htmlFor="workspace">Workspace name</Label>
            <Input id="workspace" placeholder="Acme Inc." />
        </div>
    )
}
