"use client"

import { Button, PricingCard } from "@saasflare/ui"

/** A single pricing plan with features and a call-to-action. */
export function Demo() {
    return (
        <PricingCard
            className="w-full max-w-sm"
            name="Pro"
            price="$29"
            period="month"
            description="For growing teams that ship fast."
            features={[
                "Unlimited projects",
                "Priority support",
                "Advanced analytics",
                "5 team seats",
            ]}
            cta={<Button fullWidth>Start free trial</Button>}
        />
    )
}
