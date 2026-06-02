"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    HoverCard,
    HoverCardArrow,
    HoverCardContent,
    HoverCardTrigger,
} from "@saasflare/ui"

/**
 * `HoverCardArrow` inherits the `bg-popover` token, so it stays palette- and
 * theme-reactive while pointing the preview card at its trigger.
 */
export function Demo() {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant="link">@lina_h</Button>
            </HoverCardTrigger>
            <HoverCardContent>
                <HoverCardArrow />
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
