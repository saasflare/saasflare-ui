"use client"

import { Button, Toaster } from "@saasflare/ui"
import { toast } from "sonner"

/** A button that fires a success toast — `<Toaster />` must be mounted once. */
export function Demo() {
    return (
        <div className="flex flex-col items-center gap-4">
            <Button onClick={() => toast.success("Changes saved")}>Show toast</Button>
            <Toaster position="top-right" />
        </div>
    )
}
