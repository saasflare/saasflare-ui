"use client"

import { SparkChart } from "@saasflare/ui"

/** A sparkline tucked into a KPI tile — its primary use case. */
export function Demo() {
    return (
        <div className="w-full max-w-[14rem] rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">Active users</p>
            <div className="mt-1 flex items-end justify-between gap-3">
                <span className="text-2xl font-semibold tabular-nums">12,480</span>
                <SparkChart
                    data={[42, 48, 45, 53, 61, 58, 67, 72, 80]}
                    variant="area"
                    color="oklch(0.68 0.17 155)"
                    width={72}
                    height={28}
                />
            </div>
        </div>
    )
}
