"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from "@saasflare/ui"

/** A stacked avatar group with an overflow count — useful for team rosters. */
export function Demo() {
    return (
        <AvatarGroup>
            <Avatar>
                <AvatarImage src="https://i.pravatar.cc/96?img=11" alt="Liam Park" />
                <AvatarFallback>LP</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarImage src="https://i.pravatar.cc/96?img=32" alt="Noah Kim" />
                <AvatarFallback>NK</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarImage src="https://i.pravatar.cc/96?img=47" alt="Sofia Diaz" />
                <AvatarFallback>SD</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+5</AvatarGroupCount>
        </AvatarGroup>
    )
}
