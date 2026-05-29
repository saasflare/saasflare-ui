"use client"

import { FeatureCard, Icons } from "@saasflare/ui"

const FEATURES = [
    {
        icon: <Icons.analytics />,
        title: "Real-time analytics",
        description: "Dashboards that update the moment your data changes.",
    },
    {
        icon: <Icons.share />,
        title: "Team collaboration",
        description: "Share projects and assign roles with granular permissions.",
    },
    {
        icon: <Icons.settings />,
        title: "Automation",
        description: "Trigger workflows on any event with zero configuration.",
    },
]

/** A three-up feature grid for a product page. */
export function Demo() {
    return (
        <div className="grid w-full gap-4 md:grid-cols-3">
            {FEATURES.map((feature) => (
                <FeatureCard
                    key={feature.title}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                />
            ))}
        </div>
    )
}
