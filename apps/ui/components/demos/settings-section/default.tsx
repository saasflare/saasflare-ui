"use client"

import { useState } from "react"
import { SettingsSection, Switch } from "@saasflare/ui"

/** A settings row with a label, description, and a controlled toggle. */
export function Demo() {
    const [enabled, setEnabled] = useState(true)

    return (
        <SettingsSection
            className="w-full max-w-md"
            label="Email Notifications"
            description="Receive email updates about your account activity."
        >
            <Switch checked={enabled} onCheckedChange={setEnabled} />
        </SettingsSection>
    )
}
