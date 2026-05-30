"use client"

import {
    Button,
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    MagnifyingGlassIcon,
} from "@saasflare/ui"

/** The composable Empty primitive with icon media, text, and an action. */
export function Demo() {
    return (
        <Empty className="w-full max-w-md border">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <MagnifyingGlassIcon />
                </EmptyMedia>
                <EmptyTitle>No results found</EmptyTitle>
                <EmptyDescription>
                    We couldn&apos;t find any projects matching your filters.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button variant="outline" size="sm">
                    Clear filters
                </Button>
            </EmptyContent>
        </Empty>
    )
}
