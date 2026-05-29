"use client"

import { useState } from "react"

import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from "@saasflare/ui"
import { CaretDownIcon } from "@saasflare/ui"

/** A collapsible panel revealing additional API keys for a workspace. */
export function Demo() {
    const [open, setOpen] = useState(false)

    return (
        <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-sm space-y-2">
            <div className="flex items-center justify-between gap-4 rounded-md border px-4 py-3">
                <span className="text-sm font-medium">3 API keys</span>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                        <CaretDownIcon className={open ? "rotate-180 transition-transform" : "transition-transform"} />
                        <span className="sr-only">Toggle keys</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
            <div className="rounded-md border px-4 py-2 font-mono text-sm">sk_live_4f8a…2c91</div>
            <CollapsibleContent className="space-y-2">
                <div className="rounded-md border px-4 py-2 font-mono text-sm">sk_live_91be…7d04</div>
                <div className="rounded-md border px-4 py-2 font-mono text-sm">sk_test_0a3c…ff18</div>
            </CollapsibleContent>
        </Collapsible>
    )
}
