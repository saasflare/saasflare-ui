"use client"

import { NativeSelect, NativeSelectOption } from "@saasflare/ui"

/** The small and default size variants. */
export function Demo() {
    return (
        <div className="flex flex-col gap-3 w-full max-w-sm">
            <NativeSelect size="sm" defaultValue="monthly">
                <NativeSelectOption value="monthly">Billed monthly</NativeSelectOption>
                <NativeSelectOption value="yearly">Billed yearly</NativeSelectOption>
            </NativeSelect>
            <NativeSelect size="default" defaultValue="monthly">
                <NativeSelectOption value="monthly">Billed monthly</NativeSelectOption>
                <NativeSelectOption value="yearly">Billed yearly</NativeSelectOption>
            </NativeSelect>
        </div>
    )
}
