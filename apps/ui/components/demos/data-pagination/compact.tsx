"use client"

import { useState } from "react"

import { DataPagination } from "@saasflare/ui"

/**
 * Compact controls-only variant for mobile / dense toolbars: `showNumbers={false}`
 * drops the numbered links and ellipsis, leaving just the prev/next carets. Here
 * the page count is precomputed (`pageCount`) instead of derived from an item total.
 */
export function Demo() {
    const [page, setPage] = useState(3)

    return (
        <DataPagination
            pageCount={9}
            page={page}
            showNumbers={false}
            showControls
            layout="center"
            onPageChange={setPage}
        />
    )
}
