"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@saasflare/ui"

/** The underline `line` variant for a lighter, content-focused tab bar. */
export function Demo() {
    return (
        <Tabs defaultValue="activity" className="w-96">
            <TabsList variant="line">
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="pt-3 text-sm text-muted-foreground">
                Latest deploy succeeded 4 minutes ago.
            </TabsContent>
            <TabsContent value="webhooks" className="pt-3 text-sm text-muted-foreground">
                3 endpoints configured. All delivering normally.
            </TabsContent>
            <TabsContent value="logs" className="pt-3 text-sm text-muted-foreground">
                No errors in the last 24 hours.
            </TabsContent>
        </Tabs>
    )
}
