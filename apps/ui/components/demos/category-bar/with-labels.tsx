"use client"

import { CategoryBar } from "@saasflare/ui"

/** Traffic by source with labels and percentages rendered beneath the bar. */
export function Demo() {
    return (
        <div className="w-full max-w-md">
            <CategoryBar
                showLabels
                height={12}
                segments={[
                    { value: 5200, color: "oklch(0.65 0.18 230)", label: "Organic" },
                    { value: 3100, color: "oklch(0.65 0.20 290)", label: "Paid" },
                    { value: 1800, color: "oklch(0.70 0.15 185)", label: "Referral" },
                ]}
            />
        </div>
    )
}
