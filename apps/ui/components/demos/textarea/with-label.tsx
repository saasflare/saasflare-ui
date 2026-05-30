"use client"

import { Label, Textarea } from "@saasflare/ui"

/** A labelled textarea for a project description field. */
export function Demo() {
    return (
        <div className="flex flex-col gap-2 w-full max-w-sm">
            <Label htmlFor="description">Project description</Label>
            <Textarea
                id="description"
                placeholder="Describe what your team is building…"
                rows={4}
            />
        </div>
    )
}
