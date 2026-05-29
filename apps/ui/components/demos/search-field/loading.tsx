"use client"

import { SearchField } from "@saasflare/ui"

/** The loading state, showing a spinner in place of the search icon. */
export function Demo() {
    return (
        <div className="w-full max-w-sm">
            <SearchField placeholder="Searching members…" defaultValue="ada" loading />
        </div>
    )
}
