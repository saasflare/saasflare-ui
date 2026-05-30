"use client"

import { Step, Steps } from "@saasflare/ui"

/** A vertical setup checklist tracking progress through deployment stages. */
export function Demo() {
    return (
        <Steps current={2} direction="vertical">
            <Step title="Project created" description="saasflare-prod" />
            <Step title="Environment configured" description="3 secrets added" />
            <Step title="Build running" description="Installing dependencies" />
            <Step title="Deployed" description="Pending build" />
        </Steps>
    )
}
