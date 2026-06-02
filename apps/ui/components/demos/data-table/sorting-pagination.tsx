"use client"

import { useState } from "react"
import { DataTable, Label, Switch, type DataTableColumn, type DataTableDensity } from "@saasflare/ui"

interface Deployment {
    id: string
    service: string
    env: "production" | "staging" | "preview"
    duration: number
    deployedAt: string
}

const deployments: Deployment[] = [
    { id: "d1", service: "api-gateway", env: "production", duration: 142, deployedAt: "2026-05-28" },
    { id: "d2", service: "web", env: "production", duration: 89, deployedAt: "2026-05-28" },
    { id: "d3", service: "auth", env: "staging", duration: 61, deployedAt: "2026-05-27" },
    { id: "d4", service: "billing", env: "production", duration: 203, deployedAt: "2026-05-27" },
    { id: "d5", service: "worker", env: "preview", duration: 47, deployedAt: "2026-05-26" },
    { id: "d6", service: "search", env: "staging", duration: 118, deployedAt: "2026-05-26" },
    { id: "d7", service: "notifications", env: "preview", duration: 33, deployedAt: "2026-05-25" },
    { id: "d8", service: "analytics", env: "production", duration: 176, deployedAt: "2026-05-25" },
    { id: "d9", service: "cron", env: "staging", duration: 52, deployedAt: "2026-05-24" },
    { id: "d10", service: "media", env: "preview", duration: 95, deployedAt: "2026-05-24" },
]

const columns: DataTableColumn<Deployment>[] = [
    { accessorKey: "service", header: "Service", sortable: true },
    { accessorKey: "env", header: "Environment", sortable: true },
    {
        accessorKey: "duration",
        header: "Build (s)",
        sortable: true,
        align: "end",
        cell: (row) => `${row.duration}s`,
    },
    { accessorKey: "deployedAt", header: "Deployed", sortable: true, align: "end" },
]

/** Sortable headers (shift-click for multi-sort), paginated 5/page, with a density toggle. */
export function Demo() {
    const [density, setDensity] = useState<DataTableDensity>("comfortable")

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-end gap-2">
                <Switch
                    id="density"
                    checked={density === "compact"}
                    onCheckedChange={(on) => setDensity(on ? "compact" : "comfortable")}
                />
                <Label htmlFor="density">Compact rows</Label>
            </div>

            <DataTable
                data={deployments}
                columns={columns}
                getRowId="id"
                multiSort
                defaultSort={[{ id: "deployedAt", desc: true }]}
                pageSize={5}
                density={density}
            />
        </div>
    )
}
