"use client"

import { Button, ButtonGroup } from "@saasflare/ui"

/** Buttons joined into a single connected strip. */
export function Demo() {
    return (
        <ButtonGroup>
            <Button variant="outline">Day</Button>
            <Button variant="outline">Week</Button>
            <Button variant="outline">Month</Button>
        </ButtonGroup>
    )
}
