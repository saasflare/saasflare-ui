"use client"

import { BentoGrid, BentoGridItem } from "@saasflare/ui"

/** A bento layout with spanning items and staggered entrance animation. */
export function Demo() {
    return (
        <BentoGrid className="w-full" columns={3}>
            <BentoGridItem colSpan={2} index={0}>
                <h3 className="text-base font-semibold">Unified dashboard</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                    Every metric, log, and deployment in one place.
                </p>
            </BentoGridItem>
            <BentoGridItem index={1}>
                <h3 className="text-base font-semibold">99.9% uptime</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">Backed by an SLA.</p>
            </BentoGridItem>
            <BentoGridItem index={2}>
                <h3 className="text-base font-semibold">Global edge</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">300+ locations.</p>
            </BentoGridItem>
            <BentoGridItem colSpan={2} index={3}>
                <h3 className="text-base font-semibold">Built-in analytics</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                    Privacy-first insights with zero instrumentation.
                </p>
            </BentoGridItem>
        </BentoGrid>
    )
}
