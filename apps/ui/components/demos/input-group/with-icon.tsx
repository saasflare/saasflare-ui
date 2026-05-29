"use client"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
    MagnifyingGlassIcon,
} from "@saasflare/ui"

/** A search input with a leading icon addon. */
export function Demo() {
    return (
        <div className="w-full max-w-sm">
            <InputGroup>
                <InputGroupAddon>
                    <InputGroupText>
                        <MagnifyingGlassIcon />
                    </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput placeholder="Search members…" />
            </InputGroup>
        </div>
    )
}
