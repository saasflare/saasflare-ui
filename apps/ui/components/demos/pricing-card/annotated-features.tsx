"use client"

import { Button, PricingCard } from "@saasflare/ui"

/**
 * Feature rows carrying more than a label: a tooltip that explains a limit,
 * and an excluded row that shows what the tier does *not* include. Plain
 * strings and descriptors can be mixed freely in the same list.
 */
export function Demo() {
    return (
        <div className="grid w-full gap-6 pt-3 md:grid-cols-2">
            <PricingCard
                name="Free"
                price="$0"
                description="Everything you need to validate the idea."
                features={[
                    "100 credits per month",
                    "Up to 3 projects",
                    { label: "1 seat", tooltip: "Invite teammates by upgrading to Pro." },
                    { label: "API access", excluded: true },
                    { label: "SSO & audit log", excluded: true },
                ]}
                cta={
                    <Button variant="outline" fullWidth>
                        Start free
                    </Button>
                }
            />
            <PricingCard
                featured
                badge="Most popular"
                name="Pro"
                price="$29"
                period="month"
                description="For the product that already has customers."
                features={[
                    "1,000 credits per month",
                    "Up to 20 projects",
                    { label: "5 seats", tooltip: "Add more seats at $9/month each from Settings → Team." },
                    "API access",
                    { label: "SSO & audit log", excluded: true },
                ]}
                cta={<Button fullWidth>Start 14-day trial</Button>}
            />
        </div>
    )
}
