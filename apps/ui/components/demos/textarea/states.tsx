"use client"

import { Label, Textarea } from "@saasflare/ui"

/** Disabled and invalid textarea states. */
export function Demo() {
    return (
        <div className="flex flex-col gap-4 w-full max-w-sm">
            <div className="flex flex-col gap-2">
                <Label htmlFor="notes-disabled">Internal notes (disabled)</Label>
                <Textarea
                    id="notes-disabled"
                    defaultValue="Locked while the deploy is in progress."
                    disabled
                    rows={3}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="bio-invalid">Bio (invalid)</Label>
                <Textarea id="bio-invalid" defaultValue="" aria-invalid rows={3} />
            </div>
        </div>
    )
}
