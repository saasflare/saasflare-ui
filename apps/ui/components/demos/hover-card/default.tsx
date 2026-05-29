"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@saasflare/ui"

/** A hover-triggered card previewing a user profile. */
export function Demo() {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant="link">@lina_h</Button>
            </HoverCardTrigger>
            <HoverCardContent>
                <div className="flex gap-3">
                    <Avatar>
                        <AvatarImage src="https://i.pravatar.cc/80?img=47" alt="Lina Hartmann" />
                        <AvatarFallback>LH</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold">Lina Hartmann</p>
                        <p className="text-sm text-muted-foreground">
                            Staff engineer at Acme. Maintains the deploy pipeline and the public API.
                        </p>
                        <p className="text-xs text-muted-foreground">Joined March 2021</p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}
