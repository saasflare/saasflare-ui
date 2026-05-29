"use client"

import {
    Label,
    NativeSelect,
    NativeSelectOptGroup,
    NativeSelectOption,
} from "@saasflare/ui"

/** Grouped options using NativeSelectOptGroup, with a label. */
export function Demo() {
    return (
        <div className="flex flex-col gap-2 w-full max-w-sm">
            <Label htmlFor="region">Deploy region</Label>
            <NativeSelect id="region" defaultValue="fra1">
                <NativeSelectOptGroup label="Europe">
                    <NativeSelectOption value="fra1">Frankfurt (fra1)</NativeSelectOption>
                    <NativeSelectOption value="lhr1">London (lhr1)</NativeSelectOption>
                </NativeSelectOptGroup>
                <NativeSelectOptGroup label="North America">
                    <NativeSelectOption value="iad1">Washington (iad1)</NativeSelectOption>
                    <NativeSelectOption value="sfo1">San Francisco (sfo1)</NativeSelectOption>
                </NativeSelectOptGroup>
            </NativeSelect>
        </div>
    )
}
