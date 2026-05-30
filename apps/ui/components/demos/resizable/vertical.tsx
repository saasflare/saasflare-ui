"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@saasflare/ui/resizable"

/** A nested layout: a sidebar beside a vertically split editor and console. */
export function Demo() {
    return (
        <ResizablePanelGroup
            orientation="horizontal"
            className="h-64 w-full max-w-md rounded-md border"
        >
            <ResizablePanel defaultSize={30} minSize={20}>
                <div className="flex h-full items-center justify-center p-4 text-sm font-medium">
                    Files
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70}>
                <ResizablePanelGroup orientation="vertical">
                    <ResizablePanel defaultSize={65}>
                        <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                            Editor
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={35} minSize={15}>
                        <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                            Console
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
