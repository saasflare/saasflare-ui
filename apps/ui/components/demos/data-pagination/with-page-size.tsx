"use client"

import { useState } from "react"

import { DataPagination } from "@saasflare/ui"

/**
 * The canonical table-footer pattern: controlled page plus a "rows per page"
 * selector. Changing the page size is controlled-only, so reset the page to 1
 * yourself in `onPageSizeChange`.
 */
export function Demo() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)

    return (
        <DataPagination
            total={842}
            pageSize={pageSize}
            page={page}
            showSummary
            showPageSize
            pageSizeOptions={[10, 25, 50, 100]}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
            }}
        />
    )
}
