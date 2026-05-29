"use client"

import { Button, EmptyState, Icons } from "@saasflare/ui"

/** A prop-driven empty state with icon, copy, and a call-to-action. */
export function Demo() {
    return (
        <EmptyState
            className="w-full max-w-md"
            icon={<Icons.chat className="size-12 text-muted-foreground" />}
            title="No messages yet"
            description="Start a conversation with your team to see it appear here."
            action={<Button>Compose message</Button>}
        />
    )
}
