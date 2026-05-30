"use client"

import {
    Badge,
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemSeparator,
    ItemTitle,
} from "@saasflare/ui"

const INTEGRATIONS = [
    { name: "Stripe", description: "Billing and subscriptions", status: "Connected" },
    { name: "Slack", description: "Team notifications", status: "Connected" },
    { name: "GitHub", description: "Deploy on push", status: "Not connected" },
]

/** A grouped list with separators — ideal for settings or integration lists. */
export function Demo() {
    return (
        <ItemGroup className="w-full max-w-md rounded-lg border">
            {INTEGRATIONS.map((integration, index) => (
                <div key={integration.name}>
                    {index > 0 && <ItemSeparator />}
                    <Item>
                        <ItemContent>
                            <ItemTitle>{integration.name}</ItemTitle>
                            <ItemDescription>{integration.description}</ItemDescription>
                        </ItemContent>
                        <Badge
                            variant="soft"
                            intent={integration.status === "Connected" ? "success" : "neutral"}
                        >
                            {integration.status}
                        </Badge>
                    </Item>
                </div>
            ))}
        </ItemGroup>
    )
}
