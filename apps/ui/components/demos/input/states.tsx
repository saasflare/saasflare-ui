"use client"

import { Input, Label } from "@saasflare/ui"

/** Disabled and invalid input states. */
export function Demo() {
    return (
        <div className="flex flex-col gap-4 w-full max-w-sm">
            <div className="flex flex-col gap-2">
                <Label htmlFor="email-disabled">Email (disabled)</Label>
                <Input id="email-disabled" type="email" defaultValue="owner@acme.com" disabled />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="email-invalid">Email (invalid)</Label>
                <Input id="email-invalid" type="email" defaultValue="not-an-email" aria-invalid />
            </div>
        </div>
    )
}
