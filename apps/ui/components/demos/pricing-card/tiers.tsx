"use client"

import { Button, PricingCard } from "@saasflare/ui"

/** Three plan tiers with the recommended plan highlighted via `featured`. */
export function Demo() {
    return (
        <div className="grid w-full gap-6 pt-3 md:grid-cols-3">
            <PricingCard
                name="Starter"
                price="$0"
                period="month"
                description="For solo builders."
                features={["1 project", "Community support", "1 GB storage"]}
                cta={
                    <Button variant="outline" fullWidth>
                        Get started
                    </Button>
                }
            />
            <PricingCard
                featured
                name="Pro"
                price="$29"
                period="month"
                description="For growing teams."
                features={["Unlimited projects", "Priority support", "5 seats"]}
                cta={<Button fullWidth>Start free trial</Button>}
            />
            <PricingCard
                name="Enterprise"
                price="$99"
                period="month"
                description="For large organizations."
                features={["Everything in Pro", "SSO & SAML", "Custom SLAs"]}
                cta={
                    <Button variant="outline" fullWidth>
                        Contact sales
                    </Button>
                }
            />
        </div>
    )
}
