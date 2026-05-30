"use client"

import {
    Dock,
    DockItem,
    InfoIcon,
    MagnifyingGlassIcon,
    MonitorIcon,
    MoonIcon,
    SunIcon,
} from "@saasflare/ui"

/** A macOS-style dock whose icons magnify on mouse proximity. */
export function Demo() {
    return (
        <Dock>
            <DockItem label="Search">
                <MagnifyingGlassIcon className="size-6" />
            </DockItem>
            <DockItem label="Displays">
                <MonitorIcon className="size-6" />
            </DockItem>
            <DockItem label="Light">
                <SunIcon className="size-6" />
            </DockItem>
            <DockItem label="Dark">
                <MoonIcon className="size-6" />
            </DockItem>
            <DockItem label="About">
                <InfoIcon className="size-6" />
            </DockItem>
        </Dock>
    )
}
