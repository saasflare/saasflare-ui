"use client"

import { Step, Steps } from "@saasflare/ui"

/** A horizontal onboarding flow with the second step active. */
export function Demo() {
    return (
        <Steps current={1} className="w-full max-w-lg">
            <Step title="Create account" description="Email & password" />
            <Step title="Connect data" description="Link a source" />
            <Step title="Invite team" description="Add members" />
            <Step title="Go live" description="Deploy" />
        </Steps>
    )
}
