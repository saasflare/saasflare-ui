"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@saasflare/ui"

/** A vertical tab layout for a settings sidebar. */
export function Demo() {
    return (
        <Tabs defaultValue="profile" orientation="vertical" className="w-[28rem]">
            <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="text-sm text-muted-foreground">
                Update your name, avatar, and public handle.
            </TabsContent>
            <TabsContent value="notifications" className="text-sm text-muted-foreground">
                Choose which product emails you receive.
            </TabsContent>
            <TabsContent value="security" className="text-sm text-muted-foreground">
                Two-factor authentication is enabled.
            </TabsContent>
        </Tabs>
    )
}
