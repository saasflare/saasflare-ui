"use client"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@saasflare/ui"

/** A workspace URL field with a domain prefix and an inline action button. */
export function Demo() {
    return (
        <div className="w-full max-w-sm">
            <InputGroup>
                <InputGroupAddon>app.saasflare.io/</InputGroupAddon>
                <InputGroupInput placeholder="acme" />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton variant="soft">Copy</InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>
    )
}
