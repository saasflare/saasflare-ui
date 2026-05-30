"use client"

import { BlurFade } from "@saasflare/ui"

const features = [
    "Authentication out of the box",
    "Stripe billing & subscriptions",
    "Type-safe API layer",
    "Production-ready dashboard",
]

/** Stagger a list by passing incrementing `delay` values. */
export function Demo() {
    return (
        <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-fd-card p-8">
            <ul className="space-y-3">
                {features.map((feature, i) => (
                    <BlurFade key={feature} delay={i * 0.12}>
                        <li className="text-sm font-medium">{feature}</li>
                    </BlurFade>
                ))}
            </ul>
        </div>
    )
}
