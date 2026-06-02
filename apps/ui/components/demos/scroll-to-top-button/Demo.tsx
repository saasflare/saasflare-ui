"use client"

import { ScrollToTopButton } from "@saasflare/ui"

/**
 * Scroll-to-top bound to a custom container via `scrollContainerId`.
 * Scroll the panel past 200px and the floating button reveals, then
 * smoothly returns the panel to the top on click.
 */
export function Demo() {
    return (
        <div
            id="sttb-demo"
            className="relative h-80 overflow-y-auto rounded-xl border border-border bg-card p-6"
        >
            <p className="text-sm font-medium text-muted-foreground">
                Scroll this panel down to reveal the button.
            </p>

            <div className="mt-4 space-y-4">
                {Array.from({ length: 20 }, (_, i) => (
                    <p key={i} className="text-sm leading-relaxed text-foreground">
                        Section {i + 1} — keep scrolling. Once you pass the
                        configured 200px offset, the scroll-to-top button fades
                        in. Clicking it smoothly returns this container to the
                        very top.
                    </p>
                ))}
            </div>

            <ScrollToTopButton scrollContainerId="sttb-demo" scrollOffset={200} />
        </div>
    )
}
