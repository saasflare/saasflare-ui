"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@saasflare/ui"

/** A list item with avatar media, content, and a trailing action. */
export function Demo() {
    return (
        <Item className="w-full max-w-md" variant="outline">
            <ItemMedia>
                <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/96?img=24" alt="Elena Vasquez" />
                    <AvatarFallback>EV</AvatarFallback>
                </Avatar>
            </ItemMedia>
            <ItemContent>
                <ItemTitle>Elena Vasquez</ItemTitle>
                <ItemDescription>elena@saasflare.io · Admin</ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button variant="ghost" size="sm">
                    Manage
                </Button>
            </ItemActions>
        </Item>
    )
}
