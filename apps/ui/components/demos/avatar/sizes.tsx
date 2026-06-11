"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@saasflare/ui"

/** The three avatar sizes — sm, default, and lg. */
export function Demo() {
    return (
        <div className="flex items-center gap-4">
            <Avatar size="sm">
                <AvatarImage src="https://i.pravatar.cc/96?img=5" alt="Ava Reyes" />
                <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <Avatar size="md">
                <AvatarImage src="https://i.pravatar.cc/96?img=5" alt="Ava Reyes" />
                <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
                <AvatarImage src="https://i.pravatar.cc/96?img=5" alt="Ava Reyes" />
                <AvatarFallback>AR</AvatarFallback>
            </Avatar>
        </div>
    )
}
