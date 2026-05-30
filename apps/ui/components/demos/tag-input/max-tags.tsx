"use client"

import { useState } from "react"
import { Label, TagInput } from "@saasflare/ui"

/** A tag input capped at a maximum number of entries. */
export function Demo() {
    const [recipients, setRecipients] = useState<string[]>(["ada@acme.com"])

    return (
        <div className="flex flex-col gap-2 w-full max-w-sm">
            <Label>Invite teammates (max 3)</Label>
            <TagInput
                value={recipients}
                onChange={setRecipients}
                maxTags={3}
                placeholder="Add an email…"
            />
        </div>
    )
}
