"use client"

import { useState } from "react"
import { DataTable, Button, MagnifyingGlassIcon, type DataTableColumn } from "@saasflare/ui"

interface Event {
    id: string
    type: string
    actor: string
    at: string
}

const events: Event[] = [
    { id: "e1", type: "user.login", actor: "ada@saasflare.io", at: "12:04:21" },
    { id: "e2", type: "billing.charge", actor: "system", at: "12:03:58" },
    { id: "e3", type: "project.create", actor: "grace@saasflare.io", at: "12:01:10" },
    { id: "e4", type: "key.rotate", actor: "alan@saasflare.io", at: "11:58:42" },
    { id: "e5", type: "webhook.fail", actor: "system", at: "11:55:03" },
    { id: "e6", type: "user.invite", actor: "ada@saasflare.io", at: "11:50:17" },
    { id: "e7", type: "member.remove", actor: "grace@saasflare.io", at: "11:47:29" },
]

const columns: DataTableColumn<Event>[] = [
    { accessorKey: "type", header: "Event" },
    { accessorKey: "actor", header: "Actor" },
    { accessorKey: "at", header: "Time", align: "end" },
]

type View = "data" | "loading" | "empty"

/** Loading skeletons, an empty state, and a sticky header inside a scroll container. */
export function Demo() {
    const [view, setView] = useState<View>("data")

    const rows = view === "empty" ? [] : events

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                <Button size="sm" variant={view === "data" ? "solid" : "soft"} onClick={() => setView("data")}>
                    Data
                </Button>
                <Button size="sm" variant={view === "loading" ? "solid" : "soft"} onClick={() => setView("loading")}>
                    Loading
                </Button>
                <Button size="sm" variant={view === "empty" ? "solid" : "soft"} onClick={() => setView("empty")}>
                    Empty
                </Button>
            </div>

            <DataTable
                data={rows}
                columns={columns}
                getRowId="id"
                loading={view === "loading"}
                loadingRows={5}
                stickyHeader
                maxHeight="16rem"
                emptyState={
                    <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                        <MagnifyingGlassIcon className="size-6" />
                        <span>No events in this window.</span>
                    </div>
                }
            />
        </div>
    )
}
