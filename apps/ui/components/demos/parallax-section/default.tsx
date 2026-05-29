"use client"

import { ParallaxSection } from "@saasflare/ui"

/** Children translate at a different rate than scroll, adding depth. Scroll the page. */
export function Demo() {
    return (
        <div className="h-64 w-full overflow-hidden rounded-lg border bg-fd-card">
            <ParallaxSection speed={0.5} className="flex h-full items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight">Depth on scroll</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        This block drifts as the page moves.
                    </p>
                </div>
            </ParallaxSection>
        </div>
    )
}
