"use client"

import { useState } from "react"
import { Dropzone } from "@saasflare/ui"

/** A drag-and-drop upload area restricted to images under 5 MB. */
export function Demo() {
    const [files, setFiles] = useState<File[]>([])

    return (
        <div className="flex flex-col gap-3 w-full max-w-md">
            <Dropzone
                accept="image/*"
                maxSize={5 * 1024 * 1024}
                onDrop={(accepted) => setFiles(accepted)}
            />
            {files.length > 0 && (
                <ul className="text-sm text-muted-foreground">
                    {files.map((file) => (
                        <li key={file.name}>{file.name}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}
