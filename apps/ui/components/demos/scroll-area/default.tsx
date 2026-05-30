"use client"

import { ScrollArea, Separator } from "@saasflare/ui"

const events = [
    "Deploy succeeded · api-gateway",
    "New sign-up · acme-corp.com",
    "Invoice paid · €490.00",
    "Webhook retried · stripe.charge",
    "Member invited · dana@acme.io",
    "Plan upgraded · Team → Business",
    "Rate limit raised · 10k req/min",
    "Backup completed · eu-central-1",
    "SSO enabled · Okta",
    "Deploy succeeded · worker-queue",
    "Domain verified · status.acme.io",
    "API key rotated · prod",
]

/** A fixed-height scroll area listing a stream of recent workspace events. */
export function Demo() {
    return (
        <ScrollArea className="h-64 w-full max-w-xs rounded-md border">
            <div className="p-4">
                <h4 className="mb-3 text-sm font-medium">Activity</h4>
                {events.map((event, i) => (
                    <div key={event}>
                        <div className="py-1.5 text-sm text-muted-foreground">{event}</div>
                        {i < events.length - 1 && <Separator />}
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}
