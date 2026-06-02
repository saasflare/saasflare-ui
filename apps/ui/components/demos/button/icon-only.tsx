"use client"

import { Button, MagnifyingGlassIcon } from "@saasflare/ui"

/**
 * `isIconOnly` maps each size to its square icon counterpart. Icon-only buttons
 * need an accessible name, so an `aria-label` is required. The last button shows
 * `isIconOnly` + `isLoading`, where the spinner replaces the icon.
 */
export function Demo() {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <Button isIconOnly size="xs" variant="ghost" aria-label="Search">
                <MagnifyingGlassIcon aria-hidden />
            </Button>
            <Button isIconOnly size="sm" variant="soft" aria-label="Search">
                <MagnifyingGlassIcon aria-hidden />
            </Button>
            <Button isIconOnly size="md" variant="outline" aria-label="Search">
                <MagnifyingGlassIcon aria-hidden />
            </Button>
            <Button isIconOnly size="lg" variant="solid" aria-label="Search">
                <MagnifyingGlassIcon aria-hidden />
            </Button>
            <Button isIconOnly size="md" isLoading aria-label="Searching">
                <MagnifyingGlassIcon aria-hidden />
            </Button>
        </div>
    )
}
