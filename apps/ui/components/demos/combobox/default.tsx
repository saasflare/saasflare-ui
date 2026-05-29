"use client"

import { useState } from "react"
import {
    Button,
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
} from "@saasflare/ui"

const FRAMEWORKS = [
    { value: "next", label: "Next.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
    { value: "nuxt", label: "Nuxt" },
]

/** A searchable select with controlled selection state. */
export function Demo() {
    const [value, setValue] = useState<string>()
    const selected = FRAMEWORKS.find((f) => f.value === value)

    return (
        <Combobox>
            <ComboboxTrigger asChild>
                <Button variant="outline" className="w-56 justify-between">
                    {selected?.label ?? "Select framework…"}
                </Button>
            </ComboboxTrigger>
            <ComboboxContent className="w-56">
                <ComboboxInput placeholder="Search framework…" />
                <ComboboxList>
                    <ComboboxEmpty>No framework found.</ComboboxEmpty>
                    {FRAMEWORKS.map((f) => (
                        <ComboboxItem
                            key={f.value}
                            value={f.value}
                            selected={value === f.value}
                            onSelect={setValue}
                        >
                            {f.label}
                        </ComboboxItem>
                    ))}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}
