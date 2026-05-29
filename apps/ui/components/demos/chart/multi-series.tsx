"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@saasflare/ui/chart"

const data = [
    { month: "Jan", mrr: 18200, churn: 1400 },
    { month: "Feb", mrr: 21400, churn: 1600 },
    { month: "Mar", mrr: 24800, churn: 1500 },
    { month: "Apr", mrr: 28100, churn: 1900 },
    { month: "May", mrr: 33200, churn: 2100 },
    { month: "Jun", mrr: 38600, churn: 2000 },
]

const config = {
    mrr: { label: "MRR", color: "var(--primary)" },
    churn: { label: "Churned", color: "oklch(0.62 0.21 25)" },
} satisfies ChartConfig

/** Two series — MRR vs churned revenue — with a themed legend. */
export function Demo() {
    return (
        <div className="w-full max-w-md">
            <ChartContainer config={config}>
                <LineChart data={data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line dataKey="mrr" type="monotone" stroke="var(--color-mrr)" strokeWidth={2} dot={false} />
                    <Line dataKey="churn" type="monotone" stroke="var(--color-churn)" strokeWidth={2} dot={false} />
                </LineChart>
            </ChartContainer>
        </div>
    )
}
