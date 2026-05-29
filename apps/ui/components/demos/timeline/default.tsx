"use client"

import { Timeline, TimelineItem } from "@saasflare/ui"

/** Vertical changelog with a scroll-driven progress beam. */
export function Demo() {
    return (
        <div className="w-full rounded-lg border bg-fd-card p-8">
            <Timeline>
                <TimelineItem title="v2.0 released" date="March 2026">
                    Major redesign with a new dashboard and dark mode.
                </TimelineItem>
                <TimelineItem title="v1.5 released" date="January 2026">
                    Added the billing module and usage-based pricing.
                </TimelineItem>
                <TimelineItem title="v1.0 released" date="October 2025">
                    First public release with auth, teams, and projects.
                </TimelineItem>
            </Timeline>
        </div>
    )
}
