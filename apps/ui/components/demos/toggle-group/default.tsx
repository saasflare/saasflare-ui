"use client"

import { ToggleGroup, ToggleGroupItem } from "@saasflare/ui"

/** A single-selection toggle group for text alignment. */
export function Demo() {
    return (
        <ToggleGroup type="single" defaultValue="center">
            <ToggleGroupItem value="left">Left</ToggleGroupItem>
            <ToggleGroupItem value="center">Center</ToggleGroupItem>
            <ToggleGroupItem value="right">Right</ToggleGroupItem>
        </ToggleGroup>
    )
}
