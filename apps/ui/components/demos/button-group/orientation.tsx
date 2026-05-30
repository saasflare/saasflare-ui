"use client"

import { Button, ButtonGroup } from "@saasflare/ui"

/** Horizontal and vertical orientations share rounded corners and borders. */
export function Demo() {
    return (
        <div className="flex flex-wrap items-start gap-8">
            <ButtonGroup orientation="horizontal">
                <Button variant="outline">Overview</Button>
                <Button variant="outline">Usage</Button>
                <Button variant="outline">Billing</Button>
            </ButtonGroup>
            <ButtonGroup orientation="vertical">
                <Button variant="outline">Profile</Button>
                <Button variant="outline">Team</Button>
                <Button variant="outline">API keys</Button>
            </ButtonGroup>
        </div>
    )
}
