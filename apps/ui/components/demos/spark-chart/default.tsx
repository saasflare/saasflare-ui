"use client"

import { SparkChart } from "@saasflare/ui"

/** An inline area sparkline showing a 14-day MRR trend. */
export function Demo() {
    return (
        <SparkChart
            data={[182, 190, 188, 201, 214, 209, 226, 238, 231, 247, 262, 258, 274, 289]}
            variant="area"
        />
    )
}
