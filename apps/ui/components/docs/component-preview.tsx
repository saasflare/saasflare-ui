"use client"

/**
 * @fileoverview Live component preview with a Preview/Code tab pair, used
 * inside docs MDX as `<ComponentPreview name="button/variants" />`. The demo
 * component and its source come from the generated demos registry.
 * @module apps/ui/components/docs/component-preview
 */

import { Suspense } from "react"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"
import { demos } from "@/components/demos/registry"

interface ComponentPreviewProps {
    /** Registry key, e.g. `"button/variants"`. */
    name: string
}

/** Render a registered demo: interactive in one tab, source in the other. */
export function ComponentPreview({ name }: ComponentPreviewProps) {
    const demo = demos[name]
    if (!demo) {
        return (
            <div className="my-4 rounded-lg border border-dashed p-6 text-sm text-fd-muted-foreground">
                Demo <code>{name}</code> not found.
            </div>
        )
    }
    const Demo = demo.Component
    return (
        <Tabs items={["Preview", "Code"]} className="my-4">
            <Tab value="Preview">
                <div className="flex min-h-56 w-full items-center justify-center rounded-lg border bg-fd-card p-8">
                    <Suspense fallback={<div className="text-sm text-fd-muted-foreground">Loading…</div>}>
                        <Demo />
                    </Suspense>
                </div>
            </Tab>
            <Tab value="Code">
                <DynamicCodeBlock lang="tsx" code={demo.code} />
            </Tab>
        </Tabs>
    )
}
