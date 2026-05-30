"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@saasflare/ui/chart"

const data = [
    { week: "W1", signups: 320 },
    { week: "W2", signups: 410 },
    { week: "W3", signups: 380 },
    { week: "W4", signups: 540 },
    { week: "W5", signups: 610 },
    { week: "W6", signups: 720 },
    { week: "W7", signups: 880 },
]

const config = {
    signups: { label: "Signups", color: "var(--primary)" },
} satisfies ChartConfig

/** A filled area chart tracking weekly trial signups. */
export function Demo() {
    return (
        <div className="w-full max-w-md">
            <ChartContainer config={config}>
                <AreaChart data={data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                        dataKey="signups"
                        type="natural"
                        fill="var(--color-signups)"
                        fillOpacity={0.2}
                        stroke="var(--color-signups)"
                    />
                </AreaChart>
            </ChartContainer>
        </div>
    )
}
