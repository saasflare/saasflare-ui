"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@saasflare/ui"

/** A single-open FAQ accordion with realistic billing questions. */
export function Demo() {
    return (
        <Accordion type="single" collapsible className="w-full max-w-md">
            <AccordionItem value="billing">
                <AccordionTrigger>How does billing work?</AccordionTrigger>
                <AccordionContent>
                    You are billed monthly per active seat. Upgrades are prorated instantly, and
                    downgrades take effect at the start of your next cycle.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cancel">
                <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
                <AccordionContent>
                    Yes. Cancel from Settings → Billing and you keep full access until the end of
                    the current period. No cancellation fees, ever.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="data">
                <AccordionTrigger>What happens to my data if I leave?</AccordionTrigger>
                <AccordionContent>
                    Export everything as CSV or JSON before you go. We retain data for 30 days after
                    cancellation, then permanently delete it.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
