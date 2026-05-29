"use client"

import { useState } from "react"
import { TreeView, type TreeNode } from "@saasflare/ui"

const TREE: TreeNode[] = [
    {
        id: "workspace",
        label: "Workspace",
        children: [
            { id: "projects", label: "Projects" },
            { id: "members", label: "Members" },
            {
                id: "settings",
                label: "Settings",
                children: [
                    { id: "settings/billing", label: "Billing" },
                    { id: "settings/api", label: "API keys" },
                ],
            },
        ],
    },
]

/** A tree with controlled selection rendered alongside the active node id. */
export function Demo() {
    const [selected, setSelected] = useState<string | null>("settings/billing")

    return (
        <div className="flex w-full max-w-sm flex-col gap-3">
            <TreeView
                data={TREE}
                defaultExpanded={["workspace", "settings"]}
                selected={selected}
                onSelect={setSelected}
            />
            <p className="text-sm text-muted-foreground">
                Selected: <span className="font-medium text-foreground">{selected ?? "none"}</span>
            </p>
        </div>
    )
}
