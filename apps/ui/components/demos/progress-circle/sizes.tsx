"use client"

import { ProgressCircle, type ProgressCircleSize } from "@saasflare/ui"

const sizes: ProgressCircleSize[] = ["sm", "md", "lg", "xl"]

/** The four size presets — `sm`, `md`, `lg`, `xl`. */
export function Demo() {
    return (
        <div className="flex flex-wrap items-center gap-6">
            {sizes.map((size) => (
                <div key={size} className="flex flex-col items-center gap-2">
                    <ProgressCircle value={64} size={size} />
                    <span className="text-xs text-muted-foreground">{size}</span>
                </div>
            ))}
        </div>
    )
}
