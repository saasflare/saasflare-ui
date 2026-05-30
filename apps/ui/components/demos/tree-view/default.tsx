"use client"

import { TreeView, type TreeNode } from "@saasflare/ui"

const FILES: TreeNode[] = [
    {
        id: "src",
        label: "src",
        children: [
            {
                id: "src/app",
                label: "app",
                children: [
                    { id: "src/app/layout", label: "layout.tsx" },
                    { id: "src/app/page", label: "page.tsx" },
                ],
            },
            {
                id: "src/lib",
                label: "lib",
                children: [{ id: "src/lib/cn", label: "cn.ts" }],
            },
            { id: "src/middleware", label: "middleware.ts" },
        ],
    },
    { id: "package", label: "package.json" },
    { id: "tsconfig", label: "tsconfig.json" },
]

/** A file explorer rendered from hierarchical tree data. */
export function Demo() {
    return (
        <TreeView
            className="w-full max-w-sm"
            data={FILES}
            defaultExpanded={["src", "src/app"]}
            defaultSelected="src/app/page"
        />
    )
}
