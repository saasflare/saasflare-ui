"use client"

import { useState } from "react"
import { Button, SectionCard, SettingsSection, Switch } from "@saasflare/ui"

/** Several settings rows grouped inside a SectionCard. */
export function Demo() {
    const [marketing, setMarketing] = useState(false)
    const [security, setSecurity] = useState(true)

    return (
        <SectionCard
            className="w-full max-w-md"
            title="Notifications"
            description="Choose what you want to hear about."
        >
            <div className="divide-y">
                <SettingsSection
                    label="Product updates"
                    description="News about features and improvements."
                >
                    <Switch checked={marketing} onCheckedChange={setMarketing} />
                </SettingsSection>
                <SettingsSection
                    label="Security alerts"
                    description="Get notified about new sign-ins."
                >
                    <Switch checked={security} onCheckedChange={setSecurity} />
                </SettingsSection>
                <SettingsSection
                    label="Two-factor authentication"
                    description="Add an extra layer of security to your account."
                >
                    <Button variant="outline" size="sm">
                        Enable
                    </Button>
                </SettingsSection>
            </div>
        </SectionCard>
    )
}
