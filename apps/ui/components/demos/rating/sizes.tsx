"use client"

import { Rating } from "@saasflare/ui"

/** The four available star sizes. */
export function Demo() {
    return (
        <div className="flex flex-col items-start gap-3">
            <Rating value={4} readOnly size="sm" aria-label="Small" />
            <Rating value={4} readOnly size="md" aria-label="Medium" />
            <Rating value={4} readOnly size="lg" aria-label="Large" />
            <Rating value={4} readOnly size="xl" aria-label="Extra large" />
        </div>
    )
}
