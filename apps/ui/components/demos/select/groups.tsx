"use client"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@saasflare/ui"

/** Options organised into labelled groups with a separator. */
export function Demo() {
    return (
        <Select>
            <SelectTrigger className="w-56">
                <SelectValue placeholder="Assign reviewer" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Engineering</SelectLabel>
                    <SelectItem value="ada">Ada Lovelace</SelectItem>
                    <SelectItem value="alan">Alan Turing</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                    <SelectLabel>Design</SelectLabel>
                    <SelectItem value="grace">Grace Hopper</SelectItem>
                    <SelectItem value="hedy">Hedy Lamarr</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
