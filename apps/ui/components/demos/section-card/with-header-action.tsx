"use client"

import { Badge, Button, SectionCard } from "@saasflare/ui"

/** A section panel with an action in the header and rich content. */
export function Demo() {
    return (
        <SectionCard
            className="w-full max-w-md"
            title="API Keys"
            description="Keys used to authenticate requests to the Saasflare API."
            headerAction={
                <Button variant="outline" size="sm">
                    Generate key
                </Button>
            }
        >
            <div className="flex items-center justify-between text-sm">
                <code className="font-mono text-muted-foreground">sk_live_••••4f2a</code>
                <Badge variant="soft" intent="success">
                    Active
                </Badge>
            </div>
        </SectionCard>
    )
}
