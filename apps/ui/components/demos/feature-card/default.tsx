"use client"

import { FeatureCard, Icons } from "@saasflare/ui"

/** A feature card with icon, title, and description. */
export function Demo() {
    return (
        <FeatureCard
            className="w-full max-w-sm"
            icon={<Icons.analytics />}
            title="Real-time analytics"
            description="Track every metric that matters with dashboards that update in real time."
        />
    )
}
