"use client"

import { useState } from "react"
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@saasflare/ui"

/** An application menubar with submenus, shortcuts, checkboxes, and radio groups. */
export function Demo() {
    const [autosave, setAutosave] = useState(true)
    const [theme, setTheme] = useState("system")

    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        New Project <MenubarShortcut>⌘N</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                        Open… <MenubarShortcut>⌘O</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSub>
                        <MenubarSubTrigger>Export</MenubarSubTrigger>
                        <MenubarSubContent>
                            <MenubarItem>Export as CSV</MenubarItem>
                            <MenubarItem>Export as JSON</MenubarItem>
                        </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSeparator />
                    <MenubarItem variant="destructive">Delete Project</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                    <MenubarCheckboxItem
                        checked={autosave}
                        onCheckedChange={setAutosave}
                    >
                        Autosave drafts
                    </MenubarCheckboxItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                    <MenubarRadioGroup value={theme} onValueChange={setTheme}>
                        <MenubarRadioItem value="light">Light</MenubarRadioItem>
                        <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
                        <MenubarRadioItem value="system">System</MenubarRadioItem>
                    </MenubarRadioGroup>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}
