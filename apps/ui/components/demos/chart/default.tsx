"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@saasflare/ui/chart"

const data = [
    { month: "Jan", revenue: 18200 },
    { month: "Feb", revenue: 21400 },
    { month: "Mar", revenue: 19800 },
    { month: "Apr", revenue: 26500 },
    { month: "May", revenue: 31200 },
    { month: "Jun", revenue: 34800 },
]

const config = {
    revenue: { label: "Revenue", color: "var(--primary)" },
} satisfies ChartConfig

/** A themed bar chart of monthly recurring revenue. */
export function Demo() {
    return (
        <div className="w-full max-w-md">
            <ChartContainer config={config}>
                <BarChart data={data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={6} />
                </BarChart>
            </ChartContainer>
        </div>
    )
}
