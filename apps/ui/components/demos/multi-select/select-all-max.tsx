"use client"

import * as React from "react"
import { MultiSelect, type MultiSelectOption } from "@saasflare/ui"

const PERMISSIONS: MultiSelectOption[] = [
    { value: "read", label: "Read" },
    { value: "write", label: "Write" },
    { value: "deploy", label: "Deploy" },
    { value: "billing", label: "Billing" },
    { value: "admin", label: "Admin" },
    { value: "audit", label: "Audit logs" },
]

/**
 * `selectAll` header + `max={3}`: over-limit options go non-interactive with a
 * "Max 3 selected" hint, and `maxRows={1}` collapses extra chips into a
 * "+N more" badge on the trigger.
 */
export function Demo() {
    const [value, setValue] = React.useState<string[]>(["read", "write", "deploy"])

    return (
        <div className="max-w-sm">
            <MultiSelect
                options={PERMISSIONS}
                value={value}
                onValueChange={setValue}
                selectAll
                max={3}
                maxRows={1}
                placeholder="Grant permissions…"
                searchPlaceholder="Search permissions…"
                aria-label="Permissions"
            />
        </div>
    )
}
