"use client"

import { InputGroup, InputGroupAddon, InputGroupInput } from "@saasflare/ui"

/** An input fused with a currency prefix addon into one visual unit. */
export function Demo() {
    return (
        <div className="w-full max-w-sm">
            <InputGroup>
                <InputGroupAddon>$</InputGroupAddon>
                <InputGroupInput type="number" placeholder="0.00" />
                <InputGroupAddon align="inline-end">USD</InputGroupAddon>
            </InputGroup>
        </div>
    )
}
