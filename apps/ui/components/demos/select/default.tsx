"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@saasflare/ui"

/** An animated dropdown select with a placeholder. */
export function Demo() {
    return (
        <Select>
            <SelectTrigger className="w-56">
                <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
        </Select>
    )
}
