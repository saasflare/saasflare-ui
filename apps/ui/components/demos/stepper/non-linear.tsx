"use client"

import { Stepper, StepperPanel } from "@saasflare/ui"

/**
 * Non-linear mode: every indicator step is a clickable trigger (roving focus,
 * goTo anywhere). An optional step shows the Skip button, and finished steps
 * keep their completed checkmark.
 */
export function Demo() {
    return (
        <Stepper
            linear={false}
            items={[
                { title: "Plan", description: "Pick a tier" },
                { title: "Add-ons", description: "Extras", optional: true },
                { title: "Billing", description: "Payment" },
                { title: "Review", description: "Confirm" },
            ]}
        >
            <StepperPanel value={0}>
                <div className="rounded-lg border border-border bg-card p-6">
                    <h3 className="text-base font-semibold text-foreground">Choose a plan</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Click any step in the indicator to jump straight there.
                    </p>
                </div>
            </StepperPanel>

            <StepperPanel value={1}>
                <div className="rounded-lg border border-border bg-card p-6">
                    <h3 className="text-base font-semibold text-foreground">Add-ons</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        This step is optional — use Skip to move on without selecting anything.
                    </p>
                </div>
            </StepperPanel>

            <StepperPanel value={2}>
                <div className="rounded-lg border border-border bg-card p-6">
                    <h3 className="text-base font-semibold text-foreground">Billing details</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Completed steps keep a checkmark so you can navigate back freely.
                    </p>
                </div>
            </StepperPanel>

            <StepperPanel value={3}>
                <div className="rounded-lg border border-border bg-card p-6">
                    <h3 className="text-base font-semibold text-foreground">Review &amp; confirm</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Everything looks good — Finish to subscribe.
                    </p>
                </div>
            </StepperPanel>
        </Stepper>
    )
}
