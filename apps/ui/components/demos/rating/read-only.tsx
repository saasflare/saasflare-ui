"use client"

import { Rating } from "@saasflare/ui"

/** A read-only display of an average score using half-star precision. */
export function Demo() {
    return (
        <div className="flex items-center gap-2">
            <Rating value={4.3} readOnly allowHalf size="sm" aria-label="Average rating" />
            <span className="text-sm text-muted-foreground">4.3 (1,204 reviews)</span>
        </div>
    )
}
