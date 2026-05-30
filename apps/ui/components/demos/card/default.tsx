"use client"

import {
    Button,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@saasflare/ui"

/** A complete card with header, content, footer, and a header action. */
export function Demo() {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>Unlock unlimited projects and priority support.</CardDescription>
                <CardAction>
                    <Button variant="ghost" size="sm">
                        Details
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Your team is on the Free plan. Upgrade any time — changes apply instantly.
                </p>
            </CardContent>
            <CardFooter>
                <Button fullWidth>Upgrade</Button>
            </CardFooter>
        </Card>
    )
}
