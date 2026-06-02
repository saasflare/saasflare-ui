"use client"

import { useEffect, useState } from "react"
import { DataTable, type DataTableColumn, type DataTableSort } from "@saasflare/ui"

interface Repo {
    id: string
    name: string
    stars: number
    language: string
}

// Pretend this lives behind an API. The "server" owns sort + the page window;
// the table never sorts or slices locally (manualSort + manualPagination).
const ALL: Repo[] = [
    { id: "r1", name: "saasflare/ui", stars: 4820, language: "TypeScript" },
    { id: "r2", name: "saasflare/cli", stars: 1190, language: "Go" },
    { id: "r3", name: "saasflare/edge", stars: 932, language: "Rust" },
    { id: "r4", name: "saasflare/docs", stars: 612, language: "MDX" },
    { id: "r5", name: "saasflare/sdk-py", stars: 2304, language: "Python" },
    { id: "r6", name: "saasflare/sdk-js", stars: 3870, language: "TypeScript" },
    { id: "r7", name: "saasflare/charts", stars: 740, language: "TypeScript" },
    { id: "r8", name: "saasflare/auth", stars: 1560, language: "Go" },
]

const PAGE_SIZE = 3

/** Simulates a paginated, server-sorted endpoint. */
function fetchRepos(sort: DataTableSort[], page: number): Promise<{ rows: Repo[]; total: number }> {
    const sorted = [...ALL]
    const s = sort[0]
    if (s) {
        const key = s.id as keyof Repo
        sorted.sort((a, b) => {
            const cmp = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
            return s.desc ? -cmp : cmp
        })
    }
    const start = (page - 1) * PAGE_SIZE
    return new Promise((resolve) =>
        setTimeout(() => resolve({ rows: sorted.slice(start, start + PAGE_SIZE), total: ALL.length }), 350),
    )
}

const columns: DataTableColumn<Repo>[] = [
    { accessorKey: "name", header: "Repository", sortable: true },
    { accessorKey: "language", header: "Language", sortable: true },
    { accessorKey: "stars", header: "Stars", sortable: true, align: "end", cell: (r) => r.stars.toLocaleString() },
]

/**
 * Escape hatch: server-driven sort + pagination via `manualSort` +
 * `manualPagination`. `onSortChange` / `onPageChange` re-fetch the window; the
 * component stays dependency-free.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * TanStack adapter (illustrative — `@tanstack/react-table` is NEVER a
 * dependency of `@saasflare/ui`; you'd add it yourself in your app):
 *
 *   import { useReactTable, getCoreRowModel } from "@tanstack/react-table"
 *
 *   const tt = useReactTable({
 *     data: rows,
 *     columns: tanstackColumns,
 *     manualSorting: true,
 *     manualPagination: true,
 *     state: { sorting, pagination },
 *     onSortingChange: setSorting,   // → maps to DataTable's onSortChange
 *     onPaginationChange: setPagination,
 *     getCoreRowModel: getCoreRowModel(),
 *   })
 *   // then feed tt.getRowModel().rows into <DataTable data=… manualSort manualPagination />
 * ─────────────────────────────────────────────────────────────────────────
 */
export function Demo() {
    const [sort, setSort] = useState<DataTableSort[]>([{ id: "stars", desc: true }])
    const [page, setPage] = useState(1)
    const [rows, setRows] = useState<Repo[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let active = true
        setLoading(true)
        fetchRepos(sort, page).then((res) => {
            if (!active) return
            setRows(res.rows)
            setTotal(res.total)
            setLoading(false)
        })
        return () => {
            active = false
        }
    }, [sort, page])

    return (
        <DataTable
            data={rows}
            columns={columns}
            getRowId="id"
            loading={loading}
            // Server owns ordering + the page window:
            manualSort
            sort={sort}
            onSortChange={(next) => {
                setSort(next)
                setPage(1)
            }}
            manualPagination
            rowCount={total}
            pageSize={PAGE_SIZE}
            page={page}
            onPageChange={setPage}
        />
    )
}
