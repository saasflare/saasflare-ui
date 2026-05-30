"use client"

import { useState } from "react"
import { Button, PageTransition } from "@saasflare/ui"

const pages = ["Dashboard", "Billing", "Settings"]

/** Re-animate content on key change — here, switching between mock pages. */
export function Demo() {
    const [index, setIndex] = useState(0)

    return (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-6 rounded-lg border bg-fd-card p-8">
            <PageTransition transitionKey={pages[index]}>
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight">{pages[index]}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Smooth enter/exit between route changes.
                    </p>
                </div>
            </PageTransition>
            <Button
                variant="soft"
                size="sm"
                onClick={() => setIndex((i) => (i + 1) % pages.length)}
            >
                Next page
            </Button>
        </div>
    )
}
