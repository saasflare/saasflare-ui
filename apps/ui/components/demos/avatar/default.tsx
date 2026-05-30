"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@saasflare/ui"

/** An avatar with an image and initials fallback. */
export function Demo() {
    return (
        <Avatar>
            <AvatarImage src="https://i.pravatar.cc/96?img=12" alt="Maya Chen" />
            <AvatarFallback>MC</AvatarFallback>
        </Avatar>
    )
}
