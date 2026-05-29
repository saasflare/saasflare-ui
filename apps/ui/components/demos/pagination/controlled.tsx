"use client"

import { useState } from "react"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@saasflare/ui"

const TOTAL_PAGES = 5

/** Pagination with controlled page state driving the active link. */
export function Demo() {
    const [page, setPage] = useState(1)

    return (
        <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">
                Showing invoices — page {page} of {TOTAL_PAGES}
            </p>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                setPage((p) => Math.max(1, p - 1))
                            }}
                        />
                    </PaginationItem>
                    {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((n) => (
                        <PaginationItem key={n}>
                            <PaginationLink
                                href="#"
                                isActive={n === page}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setPage(n)
                                }}
                            >
                                {n}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                setPage((p) => Math.min(TOTAL_PAGES, p + 1))
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
