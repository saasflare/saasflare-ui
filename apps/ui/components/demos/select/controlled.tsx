"use client"

import { useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@saasflare/ui"

/** A controlled select that reflects its value below the trigger. */
export function Demo() {
    const [value, setValue] = useState<string>()

    return (
        <div className="flex flex-col gap-3 w-full max-w-sm">
            <Select value={value} onValueChange={setValue}>
                <SelectTrigger className="w-56">
                    <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="preview">Preview</SelectItem>
                </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
                Deploying to: {value ?? "—"}
            </p>
        </div>
    )
}
