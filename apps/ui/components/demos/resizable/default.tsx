"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@saasflare/ui/resizable"

/** A two-pane horizontal layout you can drag to resize, with a grip handle. */
export function Demo() {
    return (
        <ResizablePanelGroup
            orientation="horizontal"
            className="h-64 w-full max-w-md rounded-md border"
        >
            <ResizablePanel defaultSize={35} minSize={20}>
                <div className="flex h-full flex-col gap-1 p-4 text-sm">
                    <span className="font-medium">Navigation</span>
                    <span className="text-muted-foreground">Dashboard</span>
                    <span className="text-muted-foreground">Projects</span>
                    <span className="text-muted-foreground">Settings</span>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={65}>
                <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                    Drag the handle to resize
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
