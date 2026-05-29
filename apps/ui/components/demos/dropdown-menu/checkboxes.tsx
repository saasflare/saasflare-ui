"use client"

import { useState } from "react"
import {
    Button,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@saasflare/ui"

/** A column-visibility menu driven by checkbox items with controlled state. */
export function Demo() {
    const [columns, setColumns] = useState({
        status: true,
        email: true,
        lastSeen: false,
    })

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Columns</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="start">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                    checked={columns.status}
                    onCheckedChange={(v) => setColumns((c) => ({ ...c, status: !!v }))}
                >
                    Status
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={columns.email}
                    onCheckedChange={(v) => setColumns((c) => ({ ...c, email: !!v }))}
                >
                    Email
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={columns.lastSeen}
                    onCheckedChange={(v) => setColumns((c) => ({ ...c, lastSeen: !!v }))}
                >
                    Last seen
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
