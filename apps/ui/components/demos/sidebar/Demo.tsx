"use client"

import { useState } from "react"
import {
    CaretRightIcon,
    CheckCircleIcon,
    CircleIcon,
    DotsThreeIcon,
    InfoIcon,
    MagnifyingGlassIcon,
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarSeparator,
    SidebarTrigger,
} from "@saasflare/ui"

const nav: { id: string; label: string; icon: typeof CircleIcon; badge?: string }[] = [
    { id: "overview", label: "Overview", icon: CircleIcon },
    { id: "inbox", label: "Inbox", icon: InfoIcon, badge: "12" },
    { id: "projects", label: "Projects", icon: CheckCircleIcon },
]

const projectSubItems = [
    { id: "acme", label: "Acme rebrand" },
    { id: "orbit", label: "Orbit launch" },
    { id: "atlas", label: "Atlas migration" },
] as const

/**
 * App shell: a collapsible `Sidebar` (header search, a labelled `SidebarMenu` with
 * an active item, a badge, and a nested `SidebarMenuSub`) beside a `SidebarInset`
 * whose `SidebarTrigger` collapses the rail. Toggle with the button or ⌘B / Ctrl+B.
 */
export function Demo() {
    const [active, setActive] = useState("projects")

    return (
        <div className="h-[28rem] overflow-hidden rounded-xl border">
            <SidebarProvider className="h-full min-h-0">
                <Sidebar collapsible="icon" variant="inset">
                    <SidebarHeader>
                        <div className="flex items-center gap-2 px-1 py-1.5">
                            <div className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-md text-sm font-semibold">
                                S
                            </div>
                            <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden">
                                Saasflare
                            </span>
                        </div>
                        <div className="relative group-data-[collapsible=icon]:hidden">
                            <MagnifyingGlassIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                            <SidebarInput aria-label="Search" placeholder="Search…" className="pl-8" />
                        </div>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                            <SidebarMenu>
                                {nav.map((item) => (
                                    <SidebarMenuItem key={item.id}>
                                        <SidebarMenuButton
                                            tooltip={item.label}
                                            isActive={active === item.id}
                                            onClick={() => setActive(item.id)}
                                        >
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
                                        {item.badge ? (
                                            <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                                        ) : null}
                                    </SidebarMenuItem>
                                ))}

                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        tooltip="Projects"
                                        isActive={projectSubItems.some((s) => s.id === active)}
                                    >
                                        <CaretRightIcon />
                                        <span>Active projects</span>
                                    </SidebarMenuButton>
                                    <SidebarMenuSub>
                                        {projectSubItems.map((sub) => (
                                            <SidebarMenuSubItem key={sub.id}>
                                                <SidebarMenuSubButton
                                                    href="#"
                                                    isActive={active === sub.id}
                                                    onClick={(event) => {
                                                        event.preventDefault()
                                                        setActive(sub.id)
                                                    }}
                                                >
                                                    <span>{sub.label}</span>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroup>
                    </SidebarContent>

                    <SidebarSeparator />

                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip="Lina Hartmann" size="lg">
                                    <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                                        LH
                                    </div>
                                    <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                                        <span className="text-sm font-medium">Lina Hartmann</span>
                                        <span className="text-muted-foreground text-xs">lina@acme.io</span>
                                    </div>
                                    <DotsThreeIcon className="ml-auto group-data-[collapsible=icon]:hidden" />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>

                <SidebarInset>
                    <header className="flex h-12 items-center gap-2 border-b px-4">
                        <SidebarTrigger />
                        <span className="text-sm font-medium">
                            {[...nav, ...projectSubItems].find((i) => i.id === active)?.label ??
                                "Active projects"}
                        </span>
                    </header>
                    <div className="text-muted-foreground flex flex-1 items-center justify-center p-6 text-sm">
                        Toggle the rail with the button or ⌘B / Ctrl+B.
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}
