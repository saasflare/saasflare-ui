"use client"

import { useEffect, useState } from "react"
import { Button } from "@saasflare/ui"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@saasflare/ui/command"

/** A modal command palette opened by a button or the ⌘K shortcut. */
export function Demo() {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((o) => !o)
            }
        }
        document.addEventListener("keydown", onKeyDown)
        return () => document.removeEventListener("keydown", onKeyDown)
    }, [])

    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)}>
                Search… ⌘K
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search the workspace…" />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Projects">
                        <CommandItem onSelect={() => setOpen(false)}>
                            Production API
                        </CommandItem>
                        <CommandItem onSelect={() => setOpen(false)}>
                            Marketing Site
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem onSelect={() => setOpen(false)}>
                            Team members
                        </CommandItem>
                        <CommandItem onSelect={() => setOpen(false)}>
                            Billing & plans
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
