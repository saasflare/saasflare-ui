"use client"

import { NativeSelect, NativeSelectOption } from "@saasflare/ui"

/** A styled wrapper around the native HTML select element. */
export function Demo() {
    return (
        <div className="w-full max-w-sm">
            <NativeSelect defaultValue="member">
                <NativeSelectOption value="owner">Owner</NativeSelectOption>
                <NativeSelectOption value="admin">Admin</NativeSelectOption>
                <NativeSelectOption value="member">Member</NativeSelectOption>
                <NativeSelectOption value="viewer">Viewer</NativeSelectOption>
            </NativeSelect>
        </div>
    )
}
