"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@saasflare/ui"

/** Tabbed sections for a project settings page. */
export function Demo() {
    return (
        <Tabs defaultValue="overview" className="w-96">
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-3 text-sm text-muted-foreground">
                Usage is up 24% this month across all environments.
            </TabsContent>
            <TabsContent value="members" className="pt-3 text-sm text-muted-foreground">
                8 active members. 2 invitations pending acceptance.
            </TabsContent>
            <TabsContent value="billing" className="pt-3 text-sm text-muted-foreground">
                Pro plan — $49/month. Next invoice on June 1.
            </TabsContent>
        </Tabs>
    )
}
