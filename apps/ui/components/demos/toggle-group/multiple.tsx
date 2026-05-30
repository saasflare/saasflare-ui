"use client"

import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@saasflare/ui"

/** A multi-selection toggle group, controlled, for text formatting. */
export function Demo() {
    const [value, setValue] = useState<string[]>(["bold"])

    return (
        <ToggleGroup
            type="multiple"
            variant="outline"
            value={value}
            onValueChange={setValue}
        >
            <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
            <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
            <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
        </ToggleGroup>
    )
}
