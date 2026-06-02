"use client"

import * as React from "react"
import { MultiSelect, type MultiSelectOption } from "@saasflare/ui"

const FRAMEWORKS: MultiSelectOption[] = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
    { value: "solid", label: "Solid" },
    { value: "angular", label: "Angular" },
    { value: "qwik", label: "Qwik" },
    { value: "astro", label: "Astro" },
]

/**
 * Baseline controlled multi-select: a `string[]` value held in `useState`,
 * chips on the trigger, search + per-row check indicators out of the box —
 * the thing you'd otherwise hand-wire from Combobox + Badge + state.
 */
export function Demo() {
    const [value, setValue] = React.useState<string[]>(["react", "svelte"])

    return (
        <div className="max-w-sm">
            <MultiSelect
                options={FRAMEWORKS}
                value={value}
                onValueChange={setValue}
                placeholder="Pick frameworks…"
                searchPlaceholder="Search frameworks…"
                aria-label="Frameworks"
            />
        </div>
    )
}
