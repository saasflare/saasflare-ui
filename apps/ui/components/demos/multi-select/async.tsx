"use client"

import * as React from "react"
import { MultiSelect, type MultiSelectOption } from "@saasflare/ui"

const DIRECTORY: MultiSelectOption[] = [
    { value: "ada", label: "Ada Lovelace" },
    { value: "alan", label: "Alan Turing" },
    { value: "grace", label: "Grace Hopper" },
    { value: "linus", label: "Linus Torvalds" },
    { value: "margaret", label: "Margaret Hamilton" },
    { value: "dennis", label: "Dennis Ritchie" },
    { value: "barbara", label: "Barbara Liskov" },
    { value: "ken", label: "Ken Thompson" },
]

/**
 * Documented async recipe: `onSearchChange` flips cmdk to `shouldFilter={false}`
 * so the server is the filter, a debounced fake fetch toggles `loading` (the
 * spinner row), and the resolved `options` array is what renders.
 */
export function Demo() {
    const [value, setValue] = React.useState<string[]>([])
    const [options, setOptions] = React.useState<MultiSelectOption[]>(DIRECTORY)
    const [loading, setLoading] = React.useState(false)
    const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

    const handleSearch = React.useCallback((query: string) => {
        window.clearTimeout(timer.current)
        setLoading(true)
        timer.current = setTimeout(() => {
            const q = query.trim().toLowerCase()
            setOptions(
                q === ""
                    ? DIRECTORY
                    : DIRECTORY.filter((o) => o.label.toLowerCase().includes(q)),
            )
            setLoading(false)
        }, 600)
    }, [])

    React.useEffect(() => () => window.clearTimeout(timer.current), [])

    return (
        <div className="max-w-sm">
            <MultiSelect
                options={options}
                value={value}
                onValueChange={setValue}
                loading={loading}
                onSearchChange={handleSearch}
                placeholder="Assign teammates…"
                searchPlaceholder="Search the directory…"
                emptyMessage="No teammates found."
                aria-label="Teammates"
            />
        </div>
    )
}
