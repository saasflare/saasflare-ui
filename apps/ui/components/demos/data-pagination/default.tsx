"use client"

import { DataPagination } from "@saasflare/ui"

/**
 * Total-driven, batteries-included: give it `total` + `pageSize` and it renders
 * prev/next controls, numbered links with ellipsis truncation, and an
 * "X–Y of N" summary — zero hand-wiring versus the `Pagination` compound.
 */
export function Demo() {
    return <DataPagination total={248} pageSize={20} showSummary />
}
