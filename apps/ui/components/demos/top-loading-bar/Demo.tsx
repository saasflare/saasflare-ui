"use client"

import { useState } from "react"
import { Button, TopLoadingBar, ArrowRightIcon } from "@saasflare/ui"

/**
 * TopLoadingBar — fakes a route transition by mounting the bar for ~1s.
 *
 * In a real app you render <TopLoadingBar /> once, high in the tree, and it
 * reacts to App-Router navigation via `usePathname` / `useSearchParams`. That
 * requires the Next.js App Router (the component wraps itself in <Suspense> so
 * `useSearchParams` is safe), so a live route change isn't available in this
 * isolated preview. Here we mount/unmount it on click to show the trickle.
 */
export function Demo() {
    const [navigating, setNavigating] = useState(false)

    function fakeNavigate() {
        setNavigating(true)
        // Unmount after a beat to simulate the destination route settling.
        window.setTimeout(() => setNavigating(false), 1000)
    }

    return (
        <div className="flex flex-col items-start gap-3">
            {/* Pinned to the top of the viewport while mounted. */}
            {navigating ? <TopLoadingBar /> : null}

            <Button
                variant="solid"
                onClick={fakeNavigate}
                disabled={navigating}
                endContent={<ArrowRightIcon aria-hidden />}
            >
                {navigating ? "Navigating…" : "Simulate navigation"}
            </Button>

            <p className="text-sm text-muted-foreground">
                Watch the bar trickle across the top of the page.
            </p>
        </div>
    )
}
