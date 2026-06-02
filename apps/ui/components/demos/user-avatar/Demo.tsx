"use client"

import { UserAvatar } from "@saasflare/ui"

/** UserAvatar — image source, initials fallback, and a clickable variant across sizes. */
export function Demo() {
    return (
        <div className="flex flex-wrap items-end gap-6">
            <UserAvatar
                src="https://i.pravatar.cc/96?img=12"
                name="Jane Doe"
                initials="JD"
                size="sm"
            />
            <UserAvatar
                src={null}
                name="Marcus Lee"
                initials="ML"
                size="md"
            />
            <UserAvatar
                src="https://i.pravatar.cc/96?img=32"
                name="Ana Ortiz"
                initials="AO"
                size="lg"
                onClick={() => alert("Opening Ana's profile…")}
            />
        </div>
    )
}
