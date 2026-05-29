"use client"

import { Button, PageHeader } from "@saasflare/ui"

/** A page header with title, description, and an action button. */
export function Demo() {
    return (
        <PageHeader
            className="w-full"
            title="Team Settings"
            description="Manage your team members and their permissions."
            actions={<Button>Invite member</Button>}
        />
    )
}
