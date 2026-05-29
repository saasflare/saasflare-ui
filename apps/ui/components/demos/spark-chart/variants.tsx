"use client"

import { SparkChart } from "@saasflare/ui"

const series = [8, 12, 9, 15, 18, 14, 22, 19, 26, 24, 31, 29]

/** The three visual variants — line, area, and bar — side by side. */
export function Demo() {
    return (
        <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-1.5">
                <SparkChart data={series} variant="line" width={96} height={32} />
                <span className="text-xs text-muted-foreground">line</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
                <SparkChart data={series} variant="area" width={96} height={32} />
                <span className="text-xs text-muted-foreground">area</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
                <SparkChart data={series} variant="bar" width={96} height={32} />
                <span className="text-xs text-muted-foreground">bar</span>
            </div>
        </div>
    )
}
