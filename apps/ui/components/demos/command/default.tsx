"use client"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@saasflare/ui/command"

/** An inline, searchable command palette grouped by section. */
export function Demo() {
    return (
        <Command className="w-80 rounded-lg border shadow-sm">
            <CommandInput placeholder="Type a command or search…" />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Navigation">
                    <CommandItem>
                        Go to Dashboard <CommandShortcut>⌘D</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                        Go to Members <CommandShortcut>⌘M</CommandShortcut>
                    </CommandItem>
                    <CommandItem>Go to Billing</CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Actions">
                    <CommandItem>
                        Invite teammate <CommandShortcut>⌘I</CommandShortcut>
                    </CommandItem>
                    <CommandItem>Create API key</CommandItem>
                    <CommandItem>View changelog</CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>
    )
}
