"use client"

import { Dropzone } from "@saasflare/ui"

/** A custom render-prop body that reacts to the drag-active state. */
export function Demo() {
    return (
        <div className="w-full max-w-md">
            <Dropzone accept=".csv" onDrop={() => {}}>
                {({ isDragActive }) => (
                    <div className="flex flex-col items-center gap-1">
                        <p className="font-medium text-foreground">
                            {isDragActive ? "Release to import" : "Import contacts"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Drop a .csv export from your CRM
                        </p>
                    </div>
                )}
            </Dropzone>
        </div>
    )
}
