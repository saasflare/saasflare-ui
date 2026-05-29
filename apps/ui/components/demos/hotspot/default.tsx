"use client"

import { Hotspot, HotspotMarker } from "@saasflare/ui"

/** Pulsing markers positioned over a screenshot, each revealing a tooltip on hover. */
export function Demo() {
    return (
        <div className="w-full max-w-2xl">
            <Hotspot className="overflow-hidden rounded-xl border">
                <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"
                    alt="Product dashboard"
                    className="aspect-video size-full object-cover"
                />
                <HotspotMarker
                    x={28}
                    y={32}
                    label="Revenue chart"
                    description="Live MRR updated every minute."
                />
                <HotspotMarker
                    x={68}
                    y={55}
                    label="Cohort retention"
                    description="See which signups stick around."
                />
                <HotspotMarker x={45} y={78} label="Export" />
            </Hotspot>
        </div>
    )
}
