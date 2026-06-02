"use client"

import { Button, ArrowRightIcon } from "@saasflare/ui"

/**
 * `isLoading` swaps in a spinner, forces `disabled` + `aria-busy`, and stops
 * hover motion. `spinnerPlacement` picks the side; the opposite slot keeps its
 * content.
 */
export function Demo() {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <Button isLoading>Saving…</Button>
            <Button isLoading spinnerPlacement="end">
                Saving…
            </Button>
            <Button
                isLoading
                spinnerPlacement="start"
                endContent={<ArrowRightIcon aria-hidden />}
            >
                Next
            </Button>
        </div>
    )
}
