"use client"

import {
    Dock,
    DockItem,
    ArrowUpIcon,
    CheckCircleIcon,
    MagnifyingGlassIcon,
    MonitorIcon,
} from "@saasflare/ui"

/** A dock with a wider magnification range and reach for a more dramatic effect. */
export function Demo() {
    return (
        <Dock magnification={1.8} distance={140}>
            <DockItem label="Overview">
                <MonitorIcon className="size-6" />
            </DockItem>
            <DockItem label="Search">
                <MagnifyingGlassIcon className="size-6" />
            </DockItem>
            <DockItem label="Deploys">
                <ArrowUpIcon className="size-6" />
            </DockItem>
            <DockItem label="Checks">
                <CheckCircleIcon className="size-6" />
            </DockItem>
        </Dock>
    )
}
