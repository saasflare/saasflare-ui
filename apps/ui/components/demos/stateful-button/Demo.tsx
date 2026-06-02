"use client"

import { useState } from "react"
import { StatefulButton } from "@saasflare/ui"

/** StatefulButton — `loading` flips on click for ~1.5s and swaps the label via `loadingText`. */
export function Demo() {
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)

    function runFor(setter: (v: boolean) => void) {
        setter(true)
        setTimeout(() => setter(false), 1500)
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            <StatefulButton
                loading={saving}
                loadingText="Saving…"
                onClick={() => runFor(setSaving)}
            >
                Save changes
            </StatefulButton>

            <StatefulButton
                variant="outline"
                intent="danger"
                loading={deleting}
                loadingText="Deleting…"
                onClick={() => runFor(setDeleting)}
            >
                Delete account
            </StatefulButton>
        </div>
    )
}
