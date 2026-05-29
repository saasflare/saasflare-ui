"use client"

import { useState } from "react"
import { SearchField } from "@saasflare/ui"

/** A search input with built-in icon and clear button. */
export function Demo() {
    const [query, setQuery] = useState("")

    return (
        <div className="w-full max-w-sm">
            <SearchField
                placeholder="Search projects…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClear={() => setQuery("")}
            />
        </div>
    )
}
