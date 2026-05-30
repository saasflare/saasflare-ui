"use client"

import { Alert, AlertDescription, AlertTitle, InfoIcon } from "@saasflare/ui"

/** A contextual alert with an icon, title, and description. */
export function Demo() {
    return (
        <Alert intent="info" className="max-w-md">
            <InfoIcon />
            <AlertTitle>Scheduled maintenance</AlertTitle>
            <AlertDescription>
                The API will be briefly unavailable on Sunday at 02:00 UTC while we upgrade the
                database cluster.
            </AlertDescription>
        </Alert>
    )
}
