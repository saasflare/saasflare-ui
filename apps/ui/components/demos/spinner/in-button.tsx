"use client"

import { Button, Spinner } from "@saasflare/ui"

/** A spinner composed inside a button to signal a pending action. */
export function Demo() {
    return (
        <Button disabled>
            <Spinner className="size-4" />
            Saving…
        </Button>
    )
}
