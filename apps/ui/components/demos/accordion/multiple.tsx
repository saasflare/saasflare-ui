"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@saasflare/ui"

/** A multi-open accordion where several sections can stay expanded at once. */
export function Demo() {
    return (
        <Accordion type="multiple" defaultValue={["security"]} className="w-full max-w-md">
            <AccordionItem value="security">
                <AccordionTrigger>Security &amp; compliance</AccordionTrigger>
                <AccordionContent>
                    SOC 2 Type II certified, with data encrypted at rest and in transit. SSO and SCIM
                    provisioning are available on the Enterprise plan.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="integrations">
                <AccordionTrigger>Integrations</AccordionTrigger>
                <AccordionContent>
                    Connect Slack, GitHub, Linear, and Stripe out of the box. Build custom workflows
                    with webhooks and the REST API.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="support">
                <AccordionTrigger>Support &amp; SLAs</AccordionTrigger>
                <AccordionContent>
                    Email support on every plan. Pro adds priority response within 4 hours, and
                    Enterprise includes a dedicated success manager with a 99.9% uptime SLA.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
