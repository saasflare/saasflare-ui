"use client"

import { useState } from "react"
import { Label, TagInput } from "@saasflare/ui"

/** Entries become removable pills on Enter or comma. */
export function Demo() {
    const [tags, setTags] = useState<string[]>(["billing", "urgent"])

    return (
        <div className="flex flex-col gap-2 w-full max-w-sm">
            <Label>Ticket labels</Label>
            <TagInput value={tags} onChange={setTags} placeholder="Add a label…" />
        </div>
    )
}
