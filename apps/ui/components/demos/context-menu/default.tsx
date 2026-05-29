"use client"

import { useState } from "react"
import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@saasflare/ui"

/** A right-click menu for a file row with a submenu and a destructive action. */
export function Demo() {
    const [starred, setStarred] = useState(false)

    return (
        <ContextMenu>
            <ContextMenuTrigger className="flex h-32 w-72 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                Right-click report.pdf
            </ContextMenuTrigger>
            <ContextMenuContent className="w-52">
                <ContextMenuLabel>report.pdf</ContextMenuLabel>
                <ContextMenuSeparator />
                <ContextMenuItem>
                    Open <ContextMenuShortcut>⌘O</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                    Rename <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuCheckboxItem
                    checked={starred}
                    onCheckedChange={setStarred}
                >
                    Star
                </ContextMenuCheckboxItem>
                <ContextMenuSub>
                    <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                        <ContextMenuItem>Copy link</ContextMenuItem>
                        <ContextMenuItem>Email file</ContextMenuItem>
                    </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuItem variant="destructive">
                    Delete <ContextMenuShortcut>⌫</ContextMenuShortcut>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
